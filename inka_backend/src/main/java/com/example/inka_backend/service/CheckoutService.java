package com.example.inka_backend.service;

import com.example.inka_backend.model.*;
import com.example.inka_backend.repository.*;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class CheckoutService {

    private static final String PROVIDER_STRIPE = "stripe";
    private static final String CURRENCY = "LKR";
    private static final long FREE_SHIPPING_THRESHOLD = 100;
    private static final long DEFAULT_SHIPPING_FEE = 9;

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CustomOrderRepository customOrderRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    private final String stripeSecretKey;
    private final String stripeWebhookSecret;
    private final String successUrl;
    private final String cancelUrl;

    public CheckoutService(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            CustomOrderRepository customOrderRepository,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            @Value("${stripe.secret-key}") String stripeSecretKey,
            @Value("${stripe.webhook-secret}") String stripeWebhookSecret,
            @Value("${stripe.success-url}") String successUrl,
            @Value("${stripe.cancel-url}") String cancelUrl) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.customOrderRepository = customOrderRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.stripeSecretKey = stripeSecretKey;
        this.stripeWebhookSecret = stripeWebhookSecret;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
        Stripe.apiKey = stripeSecretKey;
    }

    @Transactional
    public String createCartCheckoutSession(Long customerId) throws StripeException {
        List<CartItem> cartItems = cartItemRepository.findByCustomer_CustomerId(customerId);
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Order order = new Order();
        order.setCustomerId(customerId);
        order.setOrderType(OrderType.CART);
        order.setCurrency(CURRENCY);

        List<OrderItem> items = new ArrayList<>();
        long subtotal = 0;

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            long unitAmount = toMinorAmount(product.getPrice());
            int quantity = cartItem.getQuantity();
            long lineTotal = unitAmount * quantity;

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setItemType(OrderItemType.PRODUCT);
            item.setProductId(product.getProductId());
            item.setName(product.getName());
            item.setUnitAmount(unitAmount);
            item.setQuantity(quantity);
            item.setLineTotal(lineTotal);
            items.add(item);

            subtotal += lineTotal;
        }

        long shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
        long total = subtotal + shipping;

        order.setSubtotalAmount(subtotal);
        order.setShippingAmount(shipping);
        order.setTotalAmount(total);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putMetadata("orderId", String.valueOf(savedOrder.getId()));

        for (OrderItem item : items) {
            paramsBuilder.addLineItem(SessionCreateParams.LineItem.builder()
                    .setQuantity(Long.valueOf(item.getQuantity()))
                    .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(CURRENCY.toLowerCase())
                            .setUnitAmount(item.getUnitAmount())
                            .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(item.getName())
                                    .build())
                            .build())
                    .build());
        }

        if (shipping > 0) {
            paramsBuilder.addLineItem(SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(CURRENCY.toLowerCase())
                            .setUnitAmount(shipping)
                            .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("Shipping")
                                    .build())
                            .build())
                    .build());
        }

        Session session = Session.create(paramsBuilder.build());

        savedOrder.setStripeSessionId(session.getId());
        savedOrder.setStripePaymentIntentId(session.getPaymentIntent());
        orderRepository.save(savedOrder);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setProvider(PROVIDER_STRIPE);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCurrency(CURRENCY);
        payment.setAmount(total);
        payment.setStripeSessionId(session.getId());
        payment.setStripePaymentIntentId(session.getPaymentIntent());
        paymentRepository.save(payment);

        return session.getUrl();
    }

    @Transactional
    public String createCustomOrderCheckoutSession(Long customOrderId) throws StripeException {
        CustomOrder customOrder = customOrderRepository.findById(customOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Custom order not found"));

        return createCustomOrdersCheckoutSession(List.of(customOrder));
    }

    @Transactional
    public String createCustomOrdersCheckoutSession(List<CustomOrder> customOrders) throws StripeException {
        if (customOrders.isEmpty()) {
            throw new IllegalArgumentException("No custom orders provided");
        }

        Long customerId = customOrders.get(0).getCustomerId();
        Order order = new Order();
        order.setCustomerId(customerId);
        order.setOrderType(OrderType.CUSTOM);
        order.setCurrency(CURRENCY);

        List<OrderItem> items = new ArrayList<>();
        long subtotal = 0;

        for (CustomOrder customOrder : customOrders) {
            long unitAmount = toMinorAmount(customOrder.getTotalPrice());
            int quantity = 1;
            long lineTotal = unitAmount;

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setItemType(OrderItemType.CUSTOM);
            item.setCustomOrderId(customOrder.getId());
            item.setName(buildCustomOrderName(customOrder));
            item.setUnitAmount(unitAmount);
            item.setQuantity(quantity);
            item.setLineTotal(lineTotal);
            items.add(item);

            subtotal += lineTotal;
        }

        long shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
        long total = subtotal + shipping;

        order.setSubtotalAmount(subtotal);
        order.setShippingAmount(shipping);
        order.setTotalAmount(total);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);

        SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putMetadata("orderId", String.valueOf(savedOrder.getId()));

        for (OrderItem item : items) {
            paramsBuilder.addLineItem(SessionCreateParams.LineItem.builder()
                    .setQuantity(Long.valueOf(item.getQuantity()))
                    .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(CURRENCY.toLowerCase())
                            .setUnitAmount(item.getUnitAmount())
                            .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(item.getName())
                                    .build())
                            .build())
                    .build());
        }

        if (shipping > 0) {
            paramsBuilder.addLineItem(SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(CURRENCY.toLowerCase())
                            .setUnitAmount(shipping)
                            .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("Shipping")
                                    .build())
                            .build())
                    .build());
        }

        Session session = Session.create(paramsBuilder.build());

        savedOrder.setStripeSessionId(session.getId());
        savedOrder.setStripePaymentIntentId(session.getPaymentIntent());
        orderRepository.save(savedOrder);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setProvider(PROVIDER_STRIPE);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setCurrency(CURRENCY);
        payment.setAmount(total);
        payment.setStripeSessionId(session.getId());
        payment.setStripePaymentIntentId(session.getPaymentIntent());
        paymentRepository.save(payment);

        return session.getUrl();
    }

    @Transactional
    public void handleWebhook(String payload, String signature) throws StripeException {
        Event event = Webhook.constructEvent(payload, signature, stripeWebhookSecret);

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session == null) {
                return;
            }
            String sessionId = session.getId();
            Payment payment = paymentRepository.findByStripeSessionId(sessionId).orElse(null);
            if (payment == null) {
                return;
            }

            payment.setStatus(PaymentStatus.PAID);
            payment.setStripePaymentIntentId(session.getPaymentIntent());
            payment.setEventType(event.getType());
            payment.setEventPayload(payload);
            paymentRepository.save(payment);

            Order order = payment.getOrder();
            order.setStatus(OrderStatus.PAID);
            order.setStripePaymentIntentId(session.getPaymentIntent());
            orderRepository.save(order);

            if (order.getOrderType() == OrderType.CART) {
                cartItemRepository.deleteByCustomer_CustomerId(order.getCustomerId());
            }

            if (order.getOrderType() == OrderType.CUSTOM) {
                for (OrderItem item : order.getItems()) {
                    if (item.getCustomOrderId() != null) {
                        customOrderRepository.findById(item.getCustomOrderId()).ifPresent(customOrder -> {
                            customOrder.setStatus("PAID");
                            customOrderRepository.save(customOrder);
                        });
                    }
                }
            }
        }
    }

    private long toMinorAmount(Double amount) {
        if (amount == null) {
            return 0;
        }
        BigDecimal value = BigDecimal.valueOf(amount).setScale(0, RoundingMode.HALF_UP);
        return value.longValue();
    }

    private String buildCustomOrderName(CustomOrder customOrder) {
        String category = customOrder.getCategoryName() == null ? "Custom" : customOrder.getCategoryName();
        String sub = customOrder.getSubCategoryName() == null ? "" : " - " + customOrder.getSubCategoryName();
        String qty = customOrder.getQuantity() == null ? "" : " (Qty " + customOrder.getQuantity() + ")";
        return category + "" + sub + qty;
    }
}

package com.example.inka_backend.controller;

import com.example.inka_backend.dto.AdminOrderDTO;
import com.example.inka_backend.dto.AdminOrderItemDTO;
import com.example.inka_backend.model.Customer;
import com.example.inka_backend.model.Order;
import com.example.inka_backend.model.OrderItem;
import com.example.inka_backend.model.OrderStatus;
import com.example.inka_backend.model.Product;
import com.example.inka_backend.model.CustomOrder;
import com.example.inka_backend.repository.CustomerRepository;
import com.example.inka_backend.repository.OrderRepository;
import com.example.inka_backend.repository.ProductRepository;
import com.example.inka_backend.repository.CustomOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CustomOrderRepository customOrderRepository;

    @GetMapping
    public ResponseEntity<List<AdminOrderDTO>> getAllOrders() {
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();

        // Collect all IDs upfront to batch load
        List<Long> customerIds = orders.stream()
                .map(Order::getCustomerId)
                .distinct()
                .collect(java.util.stream.Collectors.toList());

        List<Long> productIds = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .map(OrderItem::getProductId)
                .filter(id -> id != null)
                .distinct()
                .collect(java.util.stream.Collectors.toList());

        List<Long> customOrderIds = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .map(OrderItem::getCustomOrderId)
                .filter(id -> id != null)
                .distinct()
                .collect(java.util.stream.Collectors.toList());

        // Batch load into maps
        Map<Long, Customer> customerMap = customerRepository.findAllById(customerIds)
                .stream().collect(java.util.stream.Collectors.toMap(Customer::getCustomerId, c -> c));

        Map<Long, Product> productMap = productRepository.findAllById(productIds)
                .stream().collect(java.util.stream.Collectors.toMap(Product::getProductId, p -> p));

        Map<Long, CustomOrder> customOrderMap = customOrderRepository.findAllById(customOrderIds)
                .stream().collect(java.util.stream.Collectors.toMap(CustomOrder::getId, co -> co));

        // Build DTOs
        List<AdminOrderDTO> dtos = new ArrayList<>();
        for (Order order : orders) {
            AdminOrderDTO dto = new AdminOrderDTO();
            dto.setId(order.getId());
            dto.setCustomerId(order.getCustomerId());
            dto.setOrderType(order.getOrderType().name());
            dto.setStatus(order.getStatus().name());
            dto.setCurrency(order.getCurrency());
            dto.setSubtotalAmount(order.getSubtotalAmount());
            dto.setShippingAmount(order.getShippingAmount());
            dto.setTotalAmount(order.getTotalAmount());
            dto.setStripeSessionId(order.getStripeSessionId());
            dto.setStripePaymentIntentId(order.getStripePaymentIntentId());
            dto.setCreatedAt(order.getCreatedAt());

            Customer customer = customerMap.get(order.getCustomerId());
            if (customer != null) {
                dto.setCustomerName(customer.getName());
                dto.setCustomerEmail(customer.getEmail());
            } else {
                dto.setCustomerName("Unknown Customer");
                dto.setCustomerEmail("Unknown Email");
            }

            List<AdminOrderItemDTO> itemDTOs = new ArrayList<>();
            for (OrderItem item : order.getItems()) {
                AdminOrderItemDTO itemDTO = new AdminOrderItemDTO();
                itemDTO.setId(item.getId());
                itemDTO.setProductId(item.getProductId());
                itemDTO.setCustomOrderId(item.getCustomOrderId());
                itemDTO.setName(item.getName());
                itemDTO.setUnitAmount(item.getUnitAmount());
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setLineTotal(item.getLineTotal());

                if (item.getProductId() != null) {
                    Product product = productMap.get(item.getProductId());
                    if (product != null) itemDTO.setImageUrl(product.getImageUrl());
                }

                if (item.getCustomOrderId() != null) {
                    CustomOrder customOrder = customOrderMap.get(item.getCustomOrderId());
                    if (customOrder != null) itemDTO.setDesignImageUrl(customOrder.getDesignImageUrl());
                }

                itemDTOs.add(itemDTO);
            }
            dto.setItems(itemDTOs);
            dtos.add(dto);
        }

        return ResponseEntity.ok(dtos);
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found with id " + id));
        String statusStr = payload.get("status");
        if (statusStr != null) {
            order.setStatus(OrderStatus.valueOf(statusStr.toUpperCase()));
            orderRepository.save(order);
        }
        return ResponseEntity.ok(order);
    }
}

package com.example.inka_backend.controller;

import com.example.inka_backend.dto.CheckoutSessionResponse;
import com.example.inka_backend.dto.CustomOrdersCheckoutRequest;
import com.example.inka_backend.model.CustomOrder;
import com.example.inka_backend.repository.CustomOrderRepository;
import com.example.inka_backend.service.CheckoutService;
import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "*")
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final CustomOrderRepository customOrderRepository;

    public CheckoutController(CheckoutService checkoutService, CustomOrderRepository customOrderRepository) {
        this.checkoutService = checkoutService;
        this.customOrderRepository = customOrderRepository;
    }

    @PostMapping("/cart/{customerId}")
    public ResponseEntity<CheckoutSessionResponse> checkoutCart(@PathVariable Long customerId) throws StripeException {
        String url = checkoutService.createCartCheckoutSession(customerId);
        return ResponseEntity.ok(new CheckoutSessionResponse(url));
    }

    @PostMapping("/custom-order/{customOrderId}")
    public ResponseEntity<CheckoutSessionResponse> checkoutCustomOrder(@PathVariable Long customOrderId) throws StripeException {
        String url = checkoutService.createCustomOrderCheckoutSession(customOrderId);
        return ResponseEntity.ok(new CheckoutSessionResponse(url));
    }

    @PostMapping("/custom-orders")
    public ResponseEntity<CheckoutSessionResponse> checkoutCustomOrders(
            @RequestBody CustomOrdersCheckoutRequest request) throws StripeException {
        List<Long> ids = request.getCustomOrderIds();
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<CustomOrder> orders = customOrderRepository.findAllById(ids);
        String url = checkoutService.createCustomOrdersCheckoutSession(orders);
        return ResponseEntity.ok(new CheckoutSessionResponse(url));
    }

    @PostMapping("/webhook/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        try {
            checkoutService.handleWebhook(payload, signature);
            return ResponseEntity.ok("ok");
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("invalid");
        }
    }
    @PostMapping("/mixed")
    public ResponseEntity<CheckoutSessionResponse> checkoutMixed(
            @RequestParam Long customerId,
            @RequestBody CustomOrdersCheckoutRequest request) throws StripeException {
        String url = checkoutService.createMixedCheckoutSession(customerId, request.getCustomOrderIds());
        return ResponseEntity.ok(new CheckoutSessionResponse(url));
    }
}
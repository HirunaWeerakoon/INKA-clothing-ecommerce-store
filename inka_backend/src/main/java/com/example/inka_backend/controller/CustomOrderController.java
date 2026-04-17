package com.example.inka_backend.controller;

import com.example.inka_backend.dto.CustomOrderDTO;
import com.example.inka_backend.model.CustomOrder;
import com.example.inka_backend.service.CustomOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/custom-orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomOrderController {

    private final CustomOrderService customOrderService;

    // POST /api/custom-orders — place a new custom order
    @PostMapping
    public ResponseEntity<CustomOrder> placeOrder(
            @RequestBody CustomOrderDTO dto) {
        return ResponseEntity.ok(customOrderService.placeOrder(dto));
    }

    // GET /api/custom-orders/{customerId} — get orders for a customer
    @GetMapping("/{customerId}")
    public ResponseEntity<List<CustomOrder>> getOrders(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(
                customOrderService.getOrdersByCustomer(customerId));
    }

    // GET /api/custom-orders — get ALL orders (for admin panel)
    @GetMapping
    public ResponseEntity<List<CustomOrder>> getAllOrders() {
        return ResponseEntity.ok(customOrderService.getAllOrders());
    }
    // PUT /api/custom-orders/item/{id} — update quantity
    @PutMapping("/item/{id}")
    public ResponseEntity<CustomOrder> updateQuantity(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Integer> body) {
        int quantity = body.getOrDefault("quantity", 1);
        return ResponseEntity.ok(customOrderService.updateQuantity(id, quantity));
    }

    // DELETE /api/custom-orders/item/{id} — delete custom order
    @DeleteMapping("/item/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        customOrderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
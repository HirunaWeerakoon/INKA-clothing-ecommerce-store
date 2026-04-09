package com.example.inka_backend.controller;

import com.example.inka_backend.dto.TempCheckoutRequest;
import com.example.inka_backend.model.TempOrder;
import com.example.inka_backend.repository.TempOrderRepository;
import com.example.inka_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/temp-orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TempOrderController {

    private final TempOrderRepository tempOrderRepository;
    private final CartService cartService;
    private final com.example.inka_backend.service.CustomOrderService customOrderService;

    // POST /api/temp-orders/checkout
    @PostMapping("/checkout")
    public ResponseEntity<TempOrder> checkout(@RequestBody TempCheckoutRequest request) {
        TempOrder order = new TempOrder();
        order.setCustomerId(request.getCustomerId());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setTotalAmount(request.getTotalAmount());
        order.setOriginalImageUrl(request.getOriginalImageUrl());
        order.setMergedImageUrl(request.getMergedImageUrl());

        String itemsJson = convertToJson(request.getCartItems());
        order.setCartItemsJson(itemsJson);

        TempOrder saved = tempOrderRepository.save(order);
        
        // Clear cart after checkout
        try {
            if (request.getCustomerId() != null && request.getCustomerId() > 0) {
                cartService.clearCart(request.getCustomerId());
                customOrderService.checkoutCustomerOrders(request.getCustomerId());
            }
        } catch (Exception e) {
            // ignore if clearing cart fails for any reason
        }

        return ResponseEntity.ok(saved);
    }

    // GET /api/temp-orders (For Admin)
    @GetMapping
    public ResponseEntity<List<TempOrder>> getAllOrders() {
        return ResponseEntity.ok(tempOrderRepository.findAll());
    }

    // PUT /api/temp-orders/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<TempOrder> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        TempOrder order = tempOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(body.get("status"));
        return ResponseEntity.ok(tempOrderRepository.save(order));
    }

    private String convertToJson(List<Object> items) {
        if (items == null || items.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < items.size(); i++) {
            Object itemObj = items.get(i);
            if (itemObj instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) itemObj;
                sb.append("{");
                int j = 0;
                for (Map.Entry<?, ?> entry : map.entrySet()) {
                    sb.append("\"").append(entry.getKey()).append("\":");
                    if (entry.getValue() instanceof Number || entry.getValue() instanceof Boolean) {
                        sb.append(entry.getValue());
                    } else if (entry.getValue() != null) {
                        sb.append("\"").append(entry.getValue().toString().replace("\"", "\\\"")).append("\"");
                    } else {
                        sb.append("null");
                    }
                    if (j < map.size() - 1) sb.append(",");
                    j++;
                }
                sb.append("}");
            } else {
                sb.append("\"").append(itemObj.toString().replace("\"", "\\\"")).append("\"");
            }
            if (i < items.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}

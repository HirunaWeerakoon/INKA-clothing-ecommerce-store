package com.example.inka_backend.controller;

import com.example.inka_backend.model.CartItem;
import com.example.inka_backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // GET /api/cart/{customerId}
    @GetMapping("/{customerId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long customerId) {
        return ResponseEntity.ok(cartService.getCartByCustomerId(customerId));
    }

    // POST /api/cart/{customerId}/add  body: { "productId": 1, "quantity": 2, "color": "Black", "size": "M" }
    @PostMapping("/{customerId}/add")
    public ResponseEntity<CartItem> addToCart(
            @PathVariable Long customerId,
            @RequestBody Map<String, Object> body) {
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = body.containsKey("quantity") ? (int) body.get("quantity") : 1;
        String color = body.containsKey("color") ? body.get("color").toString() : null;
        String size = body.containsKey("size") ? body.get("size").toString() : null;
        CartItem item = cartService.addOrUpdateItem(customerId, productId, quantity, color, size);
        return ResponseEntity.ok(item);
    }

    // PUT /api/cart/item/{itemId}  body: { "quantity": 3 }
    @PutMapping("/item/{itemId}")
    public ResponseEntity<CartItem> updateQuantity(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body) {
        int quantity = body.get("quantity");
        if (quantity <= 0) {
            cartService.removeItem(itemId);
            return ResponseEntity.noContent().build();
        }
        CartItem updated = cartService.updateItemQuantity(itemId, quantity);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/cart/item/{itemId}
    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/cart/{customerId}/clear
    @DeleteMapping("/{customerId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.noContent().build();
    }
}
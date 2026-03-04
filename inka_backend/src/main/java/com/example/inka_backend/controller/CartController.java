package com.example.inka_backend.controller;

import com.example.inka_backend.model.CartItem;
import com.example.inka_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    // GET /api/cart/{customerId}
    @GetMapping("/{customerId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long customerId) {
        return ResponseEntity.ok(cartService.getCartItems(customerId));
    }

    // POST /api/cart
    @PostMapping
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem cartItem) {
        return ResponseEntity.ok(cartService.addToCart(cartItem));
    }

    // PUT /api/cart/{id}
    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(cartService.updateQuantity(id, body.get("quantity")));
    }

    // DELETE /api/cart/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
        cartService.removeFromCart(id);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/cart/clear/{customerId}
    @DeleteMapping("/clear/{customerId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.ok().build();
    }
}

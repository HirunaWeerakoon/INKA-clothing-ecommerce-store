package com.example.inka_backend.service;

import com.example.inka_backend.model.CartItem;
import com.example.inka_backend.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;

    public List<CartItem> getCartItems(Long customerId) {
        return cartItemRepository.findByCustomerId(customerId);
    }

    public CartItem addToCart(CartItem cartItem) {
        // If same product already in cart, increment quantity
        Optional<CartItem> existing = cartItemRepository
                .findByCustomerIdAndProductId(cartItem.getCustomerId(), cartItem.getProductId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + cartItem.getQuantity());
            return cartItemRepository.save(item);
        }

        return cartItemRepository.save(cartItem);
    }

    public CartItem updateQuantity(Long id, Integer quantity) {
        CartItem item = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeFromCart(Long id) {
        cartItemRepository.deleteById(id);
    }

    @Transactional
    public void clearCart(Long customerId) {
        cartItemRepository.deleteByCustomerId(customerId);
    }
}

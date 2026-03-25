package com.example.inka_backend.service;

import com.example.inka_backend.model.CartItem;
import com.example.inka_backend.model.Customer;
import com.example.inka_backend.model.Product;
import com.example.inka_backend.repository.CartItemRepository;
import com.example.inka_backend.repository.CustomerRepository;
import com.example.inka_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getCartByCustomerId(Long customerId) {
        return cartItemRepository.findByCustomer_CustomerId(customerId);
    }

    public CartItem addOrUpdateItem(Long customerId, Long productId, int quantity) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id " + customerId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));

        return cartItemRepository.findByCustomer_CustomerIdAndProduct_ProductId(customerId, productId)
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + quantity);
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCustomer(customer);
                    newItem.setProduct(product);
                    newItem.setQuantity(quantity);
                    return cartItemRepository.save(newItem);
                });
    }

    public CartItem updateItemQuantity(Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id " + itemId));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearCart(Long customerId) {
        cartItemRepository.deleteByCustomer_CustomerId(customerId);
    }
}

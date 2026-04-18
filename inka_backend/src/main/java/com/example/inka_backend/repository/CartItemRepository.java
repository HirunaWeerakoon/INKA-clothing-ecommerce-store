package com.example.inka_backend.repository;

import com.example.inka_backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCustomer_CustomerId(Long customerId);

    Optional<CartItem> findByCustomer_CustomerIdAndProduct_ProductId(Long customerId, Long productId);

    Optional<CartItem> findByCustomer_CustomerIdAndProduct_ProductIdAndColorAndSize(
            Long customerId, Long productId, String color, String size);

    void deleteByCustomer_CustomerId(Long customerId);
}
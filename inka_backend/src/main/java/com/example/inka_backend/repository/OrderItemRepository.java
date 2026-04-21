package com.example.inka_backend.repository;

import com.example.inka_backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi " +
            "WHERE oi.productId = :productId " +
            "AND oi.order.customerId = :customerId " +
            "AND oi.order.status = 'PAID'")
    boolean existsByProductIdAndCustomerId(
            @Param("productId") Long productId,
            @Param("customerId") Long customerId);
}
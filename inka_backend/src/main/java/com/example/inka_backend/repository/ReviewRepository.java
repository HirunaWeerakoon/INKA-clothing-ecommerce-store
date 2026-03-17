package com.example.inka_backend.repository;

import com.example.inka_backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // All reviews for a product — used on the product detail page
    List<Review> findByProduct_ProductId(Long productId);

    // All reviews by a customer
    List<Review> findByCustomer_CustomerId(Long customerId);

    // Average star rating for a product
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    // Prevent duplicate reviews — one per customer per product
    boolean existsByProduct_ProductIdAndCustomer_CustomerId(Long productId, Long customerId);
}
package com.example.inka_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    // Which product this review is for
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Who wrote the review
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // Star rating 1–5
    @Column(name = "rating", nullable = false)
    private Integer rating;

    // Optional short title e.g. "Great quality!"
    @Column(name = "title")
    private String title;

    // The actual review text
    @Column(name = "body", columnDefinition = "TEXT")
    private String body;

    // Size they purchased e.g. "M", "L"
    @Column(name = "size_purchased")
    private String sizePurchased;

    // Cloudinary image URL — optional
    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
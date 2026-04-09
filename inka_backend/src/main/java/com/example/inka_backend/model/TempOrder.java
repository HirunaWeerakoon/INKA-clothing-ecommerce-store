package com.example.inka_backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "temp_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TempOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "status")
    private String status = "Processing"; // Processing, Delivering, Delivered

    @Column(name = "original_image_url")
    private String originalImageUrl;

    @Column(name = "merged_image_url")
    private String mergedImageUrl;

    @Column(name = "cart_items_json", columnDefinition = "TEXT")
    private String cartItemsJson;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

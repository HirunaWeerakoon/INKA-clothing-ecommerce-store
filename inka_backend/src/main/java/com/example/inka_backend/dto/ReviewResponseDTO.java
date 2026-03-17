package com.example.inka_backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {

    private Long reviewId;

    // Product info
    private Long productId;
    private String productName;

    // Customer info — shown on the review card
    private Long customerId;
    private String customerName;
    private String customerPictureUrl;  // Google profile photo

    // Review content
    private Integer rating;
    private String title;
    private String body;
    private String sizePurchased;

    private LocalDateTime createdAt;
}
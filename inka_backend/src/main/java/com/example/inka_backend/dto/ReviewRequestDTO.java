package com.example.inka_backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {

    @NotNull(message = "Product ID is required")
    private Long productId;

    // Rating is optional — user can leave just a comment
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    private String title;

    // Body is optional — user can leave just a rating
    private String body;

    private String sizePurchased;
}
package com.example.inka_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomOrderDTO {
    private Long customerId;
    private String categoryName;
    private String subCategoryName;
    private String gsm;
    private String material;
    private String size;
    private String color;
    private Integer quantity;
    private String designImageUrl;
    private String allDesignImageUrls; // ← add this
    private Double totalPrice;
}
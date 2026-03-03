package com.example.inka_backend.dto;

import lombok.Data;

@Data  // Lombok: auto-generates getters, setters, toString, equals
public class ProductDTO {

    private Long productId;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Boolean isAvailable;
    private String imageUrl;

    // Instead of sending the whole Category object,
    // we just send the category name as a simple String
    private Long categoryId;
    private String categoryName;
}
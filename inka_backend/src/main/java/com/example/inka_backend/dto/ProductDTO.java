package com.example.inka_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Boolean isAvailable;
    private Boolean bestSeller;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private String image1;
    private String image2;
    private String image3;
    private String image4;
    private String image5;
}

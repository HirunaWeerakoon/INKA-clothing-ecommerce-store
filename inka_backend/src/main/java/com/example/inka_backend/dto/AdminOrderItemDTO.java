package com.example.inka_backend.dto;

import lombok.Data;

@Data
public class AdminOrderItemDTO {
    private Long id;
    private Long productId;
    private Long customOrderId;
    private String name;
    private Long unitAmount;
    private Integer quantity;
    private Long lineTotal;
    
    // Extracted from related entities directly for the admin panel
    private String imageUrl;
    private String designImageUrl;
    private String allDesignImageUrls;
}

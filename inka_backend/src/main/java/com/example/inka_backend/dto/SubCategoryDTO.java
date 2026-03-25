package com.example.inka_backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryDTO {
    private Long id;
    private String name;
    private String imageUrl;
    private Long categoryId;
}
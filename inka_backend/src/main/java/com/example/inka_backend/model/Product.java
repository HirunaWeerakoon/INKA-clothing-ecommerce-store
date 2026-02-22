package com.example.inka_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "CategoryID")
    private Category category;
}
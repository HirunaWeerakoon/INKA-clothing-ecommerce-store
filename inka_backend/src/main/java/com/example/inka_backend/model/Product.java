package com.example.inka_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products") // Use plural for standard DB naming
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Double price;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "is_available")
    private Boolean isAvailable;
    @Column(name = "best_seller")
    private Boolean bestSeller;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
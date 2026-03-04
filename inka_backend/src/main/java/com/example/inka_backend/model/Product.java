package com.example.inka_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
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

    @Column(name = "Image1")
    private String image1;

    @Column(name = "Image2")
    private String image2;

    @Column(name = "Image3")
    private String image3;

    @Column(name = "Image4")
    private String image4;

    @Column(name = "Image5")
    private String image5;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;
}
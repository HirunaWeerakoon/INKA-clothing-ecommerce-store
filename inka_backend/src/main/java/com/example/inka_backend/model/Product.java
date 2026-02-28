package com.example.inka_backend.model;

import jakarta.persistence.*;
        import lombok.*;
        import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "products") // Use plural for standard DB naming
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Simplified to 'id' is a standard JPA practice

    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "category_id") // Standard snake_case
    @JsonBackReference // Prevents infinite JSON loops with Category
    private Category category;
}
package com.example.inka_backend.repository;

import com.example.inka_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByBestSellerTrue();
    List<Product> findByCategory_CategoryId(Long categoryId);
    List<Product> findByIsAvailableTrue();
}
package com.example.inka_backend.repository;

import com.example.inka_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByBestSellerTrue();

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByIsAvailableTrue();
}

package com.example.inka_backend.repository;

import com.example.inka_backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // You can add this to help find categories by name for your UI
    java.util.Optional<Category> findByCategoryName(String categoryName);
}
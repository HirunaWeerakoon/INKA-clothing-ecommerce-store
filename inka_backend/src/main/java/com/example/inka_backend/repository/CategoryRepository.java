package com.example.inka_backend.repository;

import com.example.inka_backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // No extra methods needed — JpaRepository covers everything!
}

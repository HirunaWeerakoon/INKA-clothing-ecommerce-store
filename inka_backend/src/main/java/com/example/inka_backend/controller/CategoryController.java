package com.example.inka_backend.controller;

import com.example.inka_backend.model.Category;
import com.example.inka_backend.dto.CategoryDTO;
import com.example.inka_backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping("/add")
    public Category addCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }
    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories(); // You'll need to add this method in CategoryService too
    }
}

package com.example.inka_backend.controller;

import com.example.inka_backend.dto.ProductDTO;
import com.example.inka_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products - all available products
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllAvailableProducts());
    }

    // GET /api/products/bestsellers - best-selling products for Home page
    @GetMapping("/bestsellers")
    public ResponseEntity<List<ProductDTO>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellerProducts());
    }

    // GET /api/products/category/{categoryId} - products filtered by category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }
}

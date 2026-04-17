package com.example.inka_backend.controller;

import com.example.inka_backend.dto.ProductDTO;
import com.example.inka_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController // Tells Spring: "this handles HTTP requests"
@RequestMapping("/api/products") // All endpoints start with /api/products
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allows frontend to call this API
public class ProductController {

    private final ProductService productService;

    // ✅ GET /api/products
    // Returns all available products
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // ✅ GET /api/products/1
    // Returns one product by its ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // ✅ GET /api/products/bestsellers
    // Returns all best-selling products
    @GetMapping("/bestsellers")
    public ResponseEntity<List<ProductDTO>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellers());
    }

    // ✅ GET /api/products/category/2
    // Returns all products under a specific category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    // ✅ POST /api/products
    // Creates a new product
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.createProduct(productDTO));
    }
}
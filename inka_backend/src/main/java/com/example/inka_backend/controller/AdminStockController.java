package com.example.inka_backend.controller;

import com.example.inka_backend.dto.ProductDTO;
import com.example.inka_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

// Admin-only stock management endpoints
// All routes are under /api/admin/stock
// SecurityConfig already protects /api/admin/** with ROLE_ADMIN
@RestController
@RequestMapping("/api/admin/stock")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStockController {

    private final ProductService productService;

    // GET /api/admin/stock
    // Returns all products with their stock levels (admin view)
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllStock() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    // PATCH /api/admin/stock/{id}
    // Updates the stock level for a specific product
    @PatchMapping("/{id}")
    public ResponseEntity<ProductDTO> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        int newStock = body.get("stock");
        ProductDTO product = productService.getProductById(id);
        product.setStock(newStock);
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }
}

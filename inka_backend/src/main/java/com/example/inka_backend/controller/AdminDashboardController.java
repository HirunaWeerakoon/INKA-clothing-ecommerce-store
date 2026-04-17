package com.example.inka_backend.controller;

import com.example.inka_backend.repository.CategoryRepository;
import com.example.inka_backend.repository.CustomerRepository;
import com.example.inka_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

// Admin-only dashboard stats endpoint
// Returns counts for the dashboard home stat cards
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CustomerRepository customerRepository;

    // GET /api/admin/dashboard/stats
    // Returns total products, categories, users, and low stock count
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();

        // Total number of products in the system
        stats.put("totalProducts", productRepository.count());

        // Total number of categories
        stats.put("totalCategories", categoryRepository.count());

        // Total number of registered users
        stats.put("totalUsers", customerRepository.count());

        // Products with stock of 5 or below — low stock warning
        long lowStock = productRepository.findAll()
                .stream()
                .filter(p -> p.getStock() != null && p.getStock() <= 5)
                .count();
        stats.put("lowStockCount", lowStock);

        return ResponseEntity.ok(stats);
    }
}
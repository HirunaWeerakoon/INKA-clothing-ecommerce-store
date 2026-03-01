package com.example.inka_backend.service;

import com.example.inka_backend.dto.ProductDTO;
import com.example.inka_backend.model.Product;
import com.example.inka_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service              // Tells Spring: "this is the brain"
@RequiredArgsConstructor  // Lombok: auto-generates constructor
public class ProductService {

    // Repository is injected automatically (no need for "new")
    private final ProductRepository productRepository;

    // Get ALL available products
    public List<ProductDTO> getAllProducts() {
        return productRepository.findByIsAvailableTrue()
                .stream()                    // loop through the list
                .map(this::convertToDTO)     // convert each Product → ProductDTO
                .collect(Collectors.toList()); // gather results into a list
    }

    // Get products by category
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryCategoryId(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get single product by ID
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDTO(product);
    }

    // Helper: converts Product entity → ProductDTO
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setIsAvailable(product.getIsAvailable());
        dto.setCategoryId(product.getCategory().getCategoryId());
        dto.setCategoryName(product.getCategory().getCategoryName());
        dto.setImageUrl(product.getImageUrl());


        return dto;
    }
}
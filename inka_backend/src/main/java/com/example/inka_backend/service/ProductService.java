package com.example.inka_backend.service;

import com.example.inka_backend.dto.ProductDTO;
import com.example.inka_backend.model.Product;
import com.example.inka_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Get all available products
    public List<ProductDTO> getAllAvailableProducts() {
        return productRepository.findByIsAvailableTrue()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get best-selling products (flagged as bestSeller = true)
    public List<ProductDTO> getBestSellerProducts() {
        return productRepository.findByBestSellerTrue()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get products by category ID
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategory_CategoryId(categoryId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Map Product entity -> ProductDTO
    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        dto.setIsAvailable(product.getIsAvailable());
        dto.setBestSeller(product.getBestSeller());
        dto.setImageUrl(product.getImageUrl());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getCategoryName());
        }
        return dto;
    }
}

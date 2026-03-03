package com.example.inka_backend.service;

import com.example.inka_backend.dto.ProductDTO;
import com.example.inka_backend.model.Category;
import com.example.inka_backend.model.Product;
import com.example.inka_backend.repository.CategoryRepository;
import com.example.inka_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service // Tells Spring: "this is the brain"
@RequiredArgsConstructor // Lombok: auto-generates constructor
public class ProductService {

    // Repositories are injected automatically (no need for "new")
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // Get ALL available products
    public List<ProductDTO> getAllProducts() {
        return productRepository.findByIsAvailableTrue()
                .stream() // loop through the list
                .map(this::convertToDTO) // convert each Product → ProductDTO
                .collect(Collectors.toList()); // gather results into a list
    }

    // Get best-selling products
    public List<ProductDTO> getBestSellers() {
        return productRepository.findByBestSellerTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get products by category
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get single product by ID
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return convertToDTO(product);
    }

    // Create a new product
    public ProductDTO createProduct(ProductDTO dto) {
        Product product = convertToEntity(dto);
        return convertToDTO(productRepository.save(product));
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
        dto.setBestSeller(product.getBestSeller());
        dto.setImageUrl(product.getImageUrl());
        dto.setImage1(product.getImage1());
        dto.setImage2(product.getImage2());
        dto.setImage3(product.getImage3());
        dto.setImage4(product.getImage4());
        dto.setImage5(product.getImage5());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        dto.setCategoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null);

        return dto;
    }

    // Helper: converts ProductDTO → Product entity
    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setStock(dto.getStock());
        product.setIsAvailable(dto.getIsAvailable());
        product.setImageUrl(dto.getImageUrl());
        product.setImage1(dto.getImage1());
        product.setImage2(dto.getImage2());
        product.setImage3(dto.getImage3());
        product.setImage4(dto.getImage4());
        product.setImage5(dto.getImage5());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));
            product.setCategory(category);
        }
        return product;
    }
}
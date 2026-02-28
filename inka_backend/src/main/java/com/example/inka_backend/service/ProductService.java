package com.example.inka_backend.service;

import com.example.inka_backend.dto.ProductDTO;
import com.example.inka_backend.model.Category;
import com.example.inka_backend.model.Product;
import com.example.inka_backend.repository.CategoryRepository;
import com.example.inka_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    public ProductDTO createProduct(ProductDTO dto) {
        Product product = convertToEntity(dto);
        return convertToDTO(productRepository.save(product));
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setStock(product.getStock());
        dto.setIsAvailable(product.getIsAvailable());
        dto.setImage1(product.getImage1());
        dto.setImage2(product.getImage2());
        dto.setImage3(product.getImage3());
        dto.setImage4(product.getImage4());
        dto.setImage5(product.getImage5());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null);
        return dto;
    }

    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setStock(dto.getStock());
        product.setIsAvailable(dto.getIsAvailable());
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
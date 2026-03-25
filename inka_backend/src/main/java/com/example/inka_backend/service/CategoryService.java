package com.example.inka_backend.service;

import com.example.inka_backend.dto.CategoryDTO;
import com.example.inka_backend.model.Category;
import com.example.inka_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Get all categories
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    // Create a new category
public CategoryDTO createCategory(CategoryDTO dto) {
    Category category = new Category();
    category.setCategoryName(dto.getCategoryName());
    category.setImageUrl(dto.getImageUrl());
    return convertToDTO(categoryRepository.save(category));
}

// Update an existing category by ID
public CategoryDTO updateCategory(Long categoryId, CategoryDTO dto) {
    // Find the existing category or throw error
    Category existing = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

    // Update fields from DTO
    existing.setCategoryName(dto.getCategoryName());
    existing.setImageUrl(dto.getImageUrl());

    return convertToDTO(categoryRepository.save(existing));
}

// Delete a category by ID
public void deleteCategory(Long categoryId) {
    // Check if it exists before deleting
    if (!categoryRepository.existsById(categoryId)) {
        throw new RuntimeException("Category not found with id: " + categoryId);
    }
    categoryRepository.deleteById(categoryId);
}

    // 🔄 Helper: converts Category entity → CategoryDTO
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getId());
        dto.setCategoryName(category.getCategoryName());
        dto.setImageUrl(category.getImageUrl());
        return dto;
    }
// Helper: converts CategoryDTO → Category entity
private Category convertToEntity(CategoryDTO dto) {
    Category category = new Category();
    category.setCategoryName(dto.getCategoryName());
    category.setImageUrl(dto.getImageUrl());
    return category;
}


}

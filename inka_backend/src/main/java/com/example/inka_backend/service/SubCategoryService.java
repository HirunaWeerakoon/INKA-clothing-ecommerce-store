package com.example.inka_backend.service;

import com.example.inka_backend.dto.SubCategoryDTO;
import com.example.inka_backend.repository.SubCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;

    public List<SubCategoryDTO> getSubCategoriesByCategoryId(Long categoryId) {
        return subCategoryRepository.findByCategoryId(categoryId)
                .stream()
                .map(sub -> {
                    SubCategoryDTO dto = new SubCategoryDTO();
                    dto.setId(sub.getId());
                    dto.setName(sub.getName());
                    dto.setImageUrl(sub.getImageUrl());
                    dto.setCategoryId(categoryId);
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
package com.example.inka_backend.controller;

import com.example.inka_backend.dto.SubCategoryDTO;
import com.example.inka_backend.service.SubCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    @GetMapping("/{categoryId}")
    public ResponseEntity<List<SubCategoryDTO>> getSubCategories(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(
                subCategoryService.getSubCategoriesByCategoryId(categoryId));
    }
}
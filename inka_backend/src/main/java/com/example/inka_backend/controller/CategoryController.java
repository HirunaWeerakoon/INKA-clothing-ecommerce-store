package com.example.inka_backend.controller;

<<<<<<< HEAD
import com.example.inka_backend.dto.CategoryDTO;
import com.example.inka_backend.service.CategoryService;
=======
import com.example.inka_backend.model.Category;
import com.example.inka_backend.dto.CategoryDTO;
import com.example.inka_backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
>>>>>>> c971c6435acab964ff6867b026128d673319fedd
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET /api/categories
    // Returns all categories
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}

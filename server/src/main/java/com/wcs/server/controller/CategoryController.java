package com.wcs.server.controller;

import com.wcs.server.dto.CategoryDTO;
import com.wcs.server.entity.Category;
import com.wcs.server.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {


    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "retourne la liste des catégories")
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
        @GetMapping("/notempty")
    public ResponseEntity<List<Category>> getAllCategoriesNotEmpty() {
        List<Category> categories = categoryService.getCategoriesNotEmpty();
        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "Retourne categorie par Id")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        Optional<CategoryDTO> optionalCategory = categoryService.getCategoryById(id);

        return optionalCategory.map(categoryDTO -> new ResponseEntity<>(categoryDTO, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));

    }

    @Operation(summary = "permet de supprimer une catégorie")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}

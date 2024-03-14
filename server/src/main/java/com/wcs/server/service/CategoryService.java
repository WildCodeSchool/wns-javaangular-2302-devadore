package com.wcs.server.service;

import com.wcs.server.dto.CategoryDTO;
import com.wcs.server.entity.Category;
import com.wcs.server.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final ModelMapper modelMapper;

    public CategoryService(CategoryRepository categoryRepository, ModelMapper modelMapper) {
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;

    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

      public List<Category> getCategoriesNotEmpty() {
        return categoryRepository.findAllCategoriesWithQuizzes();
    }

    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new NoSuchElementException("Category with id " + categoryId + " not found"));
        categoryRepository.delete(category);
    }


    public Optional<CategoryDTO> getCategoryById(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty()) {
            return Optional.empty();
        }
        CategoryDTO categoryDTO = modelMapper.map(optionalCategory.get(), CategoryDTO.class);
        return Optional.of(categoryDTO);
    }
}

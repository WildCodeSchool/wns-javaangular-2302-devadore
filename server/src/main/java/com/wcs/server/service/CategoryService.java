package com.wcs.server.service;

import com.wcs.server.entity.Category;
import com.wcs.server.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository; // Assuming you have a CategoryRepository interface

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}

package com.wcs.server.repository;

import java.util.Optional;

import com.wcs.server.entity.Category;

public interface CategoryRepository {

    static Optional<Category> findById(Long id) {
        return null;
    }
}

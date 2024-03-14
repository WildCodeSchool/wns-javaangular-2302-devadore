package com.wcs.server.DataTest;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import com.wcs.server.configuration.ApplicationTestConfig;
import com.wcs.server.entity.Category;
import com.wcs.server.repository.CategoryRepository;

@DataJpaTest
@Import(ApplicationTestConfig.class)
class CategoryEntityTest {

    @Autowired
    CategoryRepository CategoryRepository;

    @Test
    void testCreateCategory() {
        String name = "Culture";
        var category = new Category(name);

        CategoryRepository.saveAndFlush(category);

        Optional<Category> fromDB = CategoryRepository.findById(category.getId());

        assertTrue(fromDB.isPresent());
        assertEquals(category.getId(), fromDB.get().getId());
        assertEquals(category.getName(), fromDB.get().getName());
    }


}

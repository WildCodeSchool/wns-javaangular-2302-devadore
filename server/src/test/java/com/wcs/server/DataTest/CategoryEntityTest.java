package com.wcs.server.DataTest;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.wcs.server.ServerApplication;
import com.wcs.server.configuration.ApplicationConfig;
import com.wcs.server.entity.Category;
import com.wcs.server.repository.CategoryRepository;
import com.wcs.server.security.SecurityConfig;

@DataJpaTest
@EnableAutoConfiguration(exclude= {WebMvcAutoConfiguration.class, ApplicationConfig.class, SecurityConfig.class, ServerApplication.class})
public class CategoryEntityTest {

    @Autowired
    CategoryRepository CategoryRepository;

    @Test
    public void testCreateCategory() {
        String name = "Culture";
        var category = new Category(name);

        CategoryRepository.saveAndFlush(category);

        Optional<Category> fromDB = CategoryRepository.findById(category.getId());

        assertTrue(fromDB.isPresent());
        assertEquals(category.getId(), fromDB.get().getId());
        assertEquals(category.getName(), fromDB.get().getName()); 
    }



}

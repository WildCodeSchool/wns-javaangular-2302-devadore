package com.wcs.server;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.wcs.server.configuration.ApplicationConfig;
import com.wcs.server.configuration.ApplicationTestConfig;
import com.wcs.server.entity.Role;
import com.wcs.server.repository.RoleRepository;
import com.wcs.server.security.SecurityConfig;

@DataJpaTest
@Import(ApplicationTestConfig.class)
@EnableAutoConfiguration(exclude= {WebMvcAutoConfiguration.class, ApplicationConfig.class, SecurityConfig.class, ServerApplication.class})
public class DataTests {
    
    @Autowired
    RoleRepository RoleRepository;

    @Test
    public void testCreateRole() {
        String name = "ROLE_ADMIN";
        var role = new Role(name);

        RoleRepository.saveAndFlush(role);

        Optional<Role> fromDB = RoleRepository.findById(role.getId());

        assertTrue(fromDB.isPresent());
        assertEquals(role.getId(), fromDB.get().getId());
        assertEquals(role.getName(), fromDB.get().getName()); 
    }
    
}

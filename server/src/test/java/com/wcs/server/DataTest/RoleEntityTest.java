package com.wcs.server.DataTest;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.wcs.server.configuration.ApplicationTestConfig;
import com.wcs.server.entity.Role;
import com.wcs.server.repository.RoleRepository;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Import(ApplicationTestConfig.class)
class RoleEntityTest {

    @Autowired
    RoleRepository RoleRepository;

    @Test
    void testCreateRole() {
        String name = "ROLE_ADMIN";
        var role = new Role(name);

        RoleRepository.saveAndFlush(role);

        Optional<Role> fromDB = RoleRepository.findById(role.getId());

        assertTrue(fromDB.isPresent());
        assertEquals(role.getId(), fromDB.get().getId());
        assertEquals(role.getName(), fromDB.get().getName());
    }

    @Test
    void testGetName() {
        String name = "ROLE_ADMIN";
        var role = new Role(name);

        assertEquals(role.getName(), name);
    }

    @Test
    void testSetName() {
        String name = "ROLE_ADMIN";
        var role = new Role(name);

        String newName = "ROLE_USER";
        role.setName(newName);

        assertEquals(role.getName(), newName);
    }

    @Test
    void testGetId() {
        String name = "ROLE_ADMIN";
        var role = new Role(name);

        assertNull(role.getId());
    }

    @Test
    void testSetId() {
        String name = "ROLE_ADMIN";
        var role = new Role(name);

        Long id = (long) 1;
        role.setId(id);

        assertEquals(role.getId(), id);
    }


}

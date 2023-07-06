package com.wcs.server.repository;

import com.wcs.server.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> getRoleByName(String name);

    Role findByName(String user);
}

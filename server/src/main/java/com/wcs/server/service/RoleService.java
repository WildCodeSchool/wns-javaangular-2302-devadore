package com.wcs.server.service;

import com.wcs.server.dto.RoleDTO;
import com.wcs.server.entity.Role;
import com.wcs.server.repository.RoleRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    private final ModelMapper modelMapper;

    public RoleService(RoleRepository roleRepository, ModelMapper modelMapper) {
        this.roleRepository = roleRepository;
        this.modelMapper = modelMapper;
    }

    public List<RoleDTO> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        List<RoleDTO> roleDTOs = roles.stream()
                .map(role -> modelMapper.map(role, RoleDTO.class))
                .collect(Collectors.toList());

        return roleDTOs;
    }

    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id).orElse(null);
        if (role == null) {
            return null;
        }
        return modelMapper.map(role, RoleDTO.class);
    }

    public RoleDTO createRole(RoleDTO roleDTO) {
        Role role = modelMapper.map(roleDTO, Role.class);
        Role savedRole = roleRepository.save(role);
        return modelMapper.map(savedRole, RoleDTO.class);
    }

    public RoleDTO updateRole(Long id, RoleDTO roleDTO) {
        Role role = roleRepository.findById(id).orElse(null);
        if (role == null) {
            return null;
        }
        modelMapper.map(roleDTO, role);
        Role updatedRole = roleRepository.save(role);
        return modelMapper.map(updatedRole, RoleDTO.class);
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}

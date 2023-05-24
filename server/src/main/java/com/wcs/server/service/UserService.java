package com.wcs.server.service;

import com.wcs.server.dto.RoleDTO;
import com.wcs.server.entity.Quiz;
import com.wcs.server.entity.Role;
import com.wcs.server.entity.UserRegistrationRequest;
import com.wcs.server.repository.QuizRepository;
import com.wcs.server.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wcs.server.dto.UserDTO;
import com.wcs.server.entity.User;
import com.wcs.server.repository.UserRepository;


import java.util.List;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        List<RoleDTO> roleDTOs = user.getRoles().stream()
                .map(role -> modelMapper.map(role, RoleDTO.class))
                .collect(Collectors.toList());

        userDTO.setRoles(roleDTOs);
        return modelMapper.map(user, UserDTO.class);
    }
    public UserDTO createUser(UserDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        List<Role> roles = userDTO.getRoles().stream()
                .map(roleDTO -> modelMapper.map(roleDTO, Role.class))
                .collect(Collectors.toList());
        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }

public UserDTO updateUser(Long id, UserDTO userDTO) {
    User user = userRepository.findById(id).orElse(null);
    if (user == null) {
        return null;
    }


    modelMapper.typeMap(UserDTO.class, User.class)
            .addMappings(mapper -> mapper.skip(User::setRoles))
            .map(userDTO, user);


    if(userDTO.getRoles() != null) {
        List<Role> roles = userDTO.getRoles().stream()
                .map(roleDto -> roleRepository.findById(roleDto.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Role with id " + roleDto.getId() + " not found")))
                .collect(Collectors.toList());
        user.setRoles(roles);
    }

    User updatedUser = userRepository.save(user);
    System.out.println("Updated user with roles: " + updatedUser.getRoles());
    return modelMapper.map(updatedUser, UserDTO.class);
}
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User with id " + userId + " not found"));

        // Deleting quizzes associated with user, which will cascade to questions and answers.
        List<Quiz> quizzes = quizRepository.findByCreatedBy(user);
        for (Quiz quiz : quizzes) {
            quizRepository.delete(quiz);
        }

        // Delete user after quizzes, questions and answers have been deleted.
        userRepository.delete(user);
    }

    public User registerUser(UserRegistrationRequest registrationRequest) {

        if (userRepository.findByUsername(registrationRequest.getUsername()) != null) {
            return null;
        }

        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setEmail(registrationRequest.getEmail());

        Role userRole = roleRepository.findByName("USER");
        user.getRoles().add(userRole);

        return userRepository.save(user);
    }


}

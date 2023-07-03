package com.wcs.server.service;

import com.wcs.server.dto.RoleDTO;
import com.wcs.server.entity.*;
import com.wcs.server.repository.ImageRepository;
import com.wcs.server.repository.QuizRepository;
import com.wcs.server.repository.RoleRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wcs.server.dto.UserDTO;
import com.wcs.server.repository.UserRepository;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
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

        if (user.getImage() != null) {
            Image image = user.getImage();
            userDTO.setImage(image.getImage());
            userDTO.setMimeType(image.getMimeType());
        }
/*        return modelMapper.map(user, UserDTO.class);*/
        return userDTO;
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
    if (userDTO.getImage() != null && userDTO.getMimeType() != null) {
        Image image = new Image();
        image.setName(userDTO.getUsername() + "_image");
        image.setImage(userDTO.getImage());
        image.setMimeType(userDTO.getMimeType());
        image.setUser(user);
        user.setImage(image);
    }
    User updatedUser = userRepository.save(user);
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

        // Ajouter une image à l'utilisateur
        if (registrationRequest.getImage() != null) {
            Image image = new Image();
            image.setName(registrationRequest.getUsername() + "_image");
            image.setImage(registrationRequest.getImage());
            image.setMimeType(registrationRequest.getMimeType());
            image.setUser(user);
            user.setImage(image);
        }

        return userRepository.save(user);
    }

    public User updateUserImage(Long userId, byte[] imageData, String mimeType) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        try {
            // Vérifier si l'objet Image existe déjà
            Image userImage = user.getImage();
            if (userImage == null) {
                // Créer une nouvelle instance d'Image
                userImage = new Image();
            }

            // Mettre à jour les données de l'image
            userImage.setImage(imageData);
            userImage.setMimeType(mimeType);
            userImage.setName(user.getUsername() + "_image");

            // Mettre à jour la relation entre User et Image
            user.setImage(userImage);
            userImage.setUser(user);

            // Enregistrer les modifications dans la base de données
            User updatedUser = userRepository.save(user);


            return updatedUser;
        } catch (Exception e) {
            // Gérer l'exception en conséquence
            e.printStackTrace();
            return null;
        }
    }
//TODO créer des objets DTO distincts pour les opérations de sérialisation et de désérialisation JSON.
// Ces objets DTO ne contiendront que les données nécessaires et éviteront les références cycliques.
// mapper les objets d'entité vers les objets DTO et vice versa lors des opérations de sérialisation et de désérialisation.
   /* public UserDTO updateUserImage(Long userId, byte[] imageData, String mimeType) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        try {
            // Vérifier si l'objet Image existe déjà
            Image userImage = user.getImage();
            if (userImage == null) {
                // Créer une nouvelle instance d'Image
                userImage = new Image();
            }

            // Mettre à jour les données de l'image
            userImage.setImage(imageData);
            userImage.setMimeType(mimeType);
            userImage.setName(user.getUsername() + "_image");

            // Mettre à jour la relation entre User et Image
            user.setImage(userImage);
            userImage.setUser(user);

            // Enregistrer les modifications dans la base de données
            User updatedUser = userRepository.save(user);

            // Mapper l'objet User mis à jour vers UserDTO
            UserDTO updatedUserDTO = modelMapper.map(updatedUser, UserDTO.class);

            return updatedUserDTO;
        } catch (Exception e) {
            // Gérer l'exception en conséquence
            e.printStackTrace();
            return null;
        }
    }*/

}





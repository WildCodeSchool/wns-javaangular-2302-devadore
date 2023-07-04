package com.wcs.server.controller;


import com.wcs.server.dto.RoleDTO;
import com.wcs.server.dto.UserDTO;

import com.wcs.server.entity.User;
import com.wcs.server.service.RoleService;
import com.wcs.server.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/list")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        UserDTO newUser = userService.createUser(userDTO);
        return ResponseEntity.ok(newUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<UserDTO> updateUserImage(@PathVariable Long id, MultipartHttpServletRequest request) {
        UserDTO user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            MultipartFile imageDTO = request.getFile("image");
            // Vérifier si un fichier a été téléchargé
            if (imageDTO != null && !imageDTO.isEmpty()) {
                // Ajouter des logs pour vérifier le fichier
                System.out.println("Fichier récupéré : " + imageDTO.getOriginalFilename());
                System.out.println("Type MIME : " + imageDTO.getContentType());

                // Mettre à jour l'image de l'utilisateur avec la nouvelle image
                byte[] imageData = imageDTO.getBytes();
                String mimeType = imageDTO.getContentType();

                // Appeler votre logique de mise à jour de l'image de l'utilisateur avec les données du fichier
                User updatedUser  = userService.updateUserImage(id, imageData, mimeType);
                if (updatedUser  == null) {
                    return ResponseEntity.notFound().build();
                }

                UserDTO userDTO = modelMapper.map(updatedUser, UserDTO.class);
                return ResponseEntity.ok(userDTO);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/roles")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<RoleDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
    @GetMapping("/roles/{id}")
    public RoleDTO getRoleById(Long id) {
        return roleService.getRoleById(id);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getUserImage(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        if (user == null || user.getImage() == null || user.getMimeType() == null) {
            return ResponseEntity.notFound().build();
        }

        String base64Image = Base64.getEncoder().encodeToString(user.getImage());
        byte[] decodedImage = Base64.getDecoder().decode(base64Image);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(user.getMimeType())).body(decodedImage);
    }
    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        userService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }

}

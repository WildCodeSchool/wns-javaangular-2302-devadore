package com.wcs.server.controller;

import com.wcs.server.dto.RoleDTO;
import com.wcs.server.dto.UserDTO;

import com.wcs.server.entity.User;
import com.wcs.server.service.RoleService;
import com.wcs.server.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
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

    @Operation(summary = "Retourne la liste de tous les utilisateurs")
    @GetMapping("/list")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Retourne l'ID de l'utilisateur")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Retourne Id de par le username")
    @GetMapping("/name/id")
    public ResponseEntity<Long> getUserIdByUsername(@RequestParam String username) {
        Long userId = userService.getUserIdByUsername(username);
        if (userId != null) {
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "permet de créer un utlisateur - pas utilisé")
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        UserDTO newUser = userService.createUser(userDTO);
        return ResponseEntity.ok(newUser);
    }

    @Operation(summary = "permet de mettre à jour un utlisateur pas son ID")
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "permet de mettre à jour l'image d'un utlisateur")
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

                // Mettre à jour l'image de l'utilisateur avec la nouvelle image
                byte[] imageData = imageDTO.getBytes();
                String mimeType = imageDTO.getContentType();

                // Logique de mise à jour de l'image de l'utilisateur avec les données du fichier
                User updatedUser = userService.updateUserImage(id, imageData, mimeType);
                if (updatedUser == null) {
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

    @Operation(summary = "permet de supprimer un utilisateur")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "permet de récupérer la liste de tous les roles")
    @GetMapping("/roles")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<RoleDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @Operation(summary = "permet de retrouver un role par son ID")
    @GetMapping("/roles/{id}")
    public RoleDTO getRoleById(Long id) {
        return roleService.getRoleById(id);
    }

    @Operation(summary = "permet de récupérer l'image d'un utilisateur")
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getUserImage(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        if (user == null || user.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] imageBytes = user.getImage();

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.parseMediaType(user.getMimeType()));
        headers.setContentLength(imageBytes.length);

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    @Operation(summary = "permet de supprimer l'image d'un utilisateur")
    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        userService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }

}

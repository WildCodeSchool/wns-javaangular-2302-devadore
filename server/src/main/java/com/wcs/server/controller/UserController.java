package com.wcs.server.controller;

import com.wcs.server.dto.RoleDTO;
import com.wcs.server.dto.UserDTO;

import com.wcs.server.entity.User;
import com.wcs.server.repository.UserRepository;
import com.wcs.server.service.RoleService;
import com.wcs.server.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final RoleService roleService;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public UserController(UserService userService, RoleService roleService, UserRepository userRepository, ModelMapper modelMapper) {
        this.userService = userService;
        this.roleService = roleService;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

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
        // Récupérer l'utilisateur authentifié
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        // Récupérer l'utilisateur authentifié depuis la base de données
        User currentUser = userRepository.findByUsername(currentUsername);
        if (currentUser == null) {
            // L'utilisateur authentifié n'a pas été trouvé dans la base de données
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        // Vérifier si l'utilisateur a le droit de mettre à jour ce profil
        if (!currentUser.getId().equals(id) && !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"))) {
            // L'utilisateur n'essaye pas de mettre à jour son propre profil et n'est pas un administrateur
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Mise à jour de l'utilisateur si l'utilisateur authentifié a le droit de le faire
        try {
            UserDTO updatedUser = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (EntityNotFoundException e) {
            // L'utilisateur à mettre à jour n'a pas été trouvé dans la base de données
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "permet de mettre à jour l'image d'un utlisateur")
    @PutMapping("/{id}/image")
    public ResponseEntity<UserDTO> updateUserImage(@PathVariable Long id, MultipartHttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        // Récupérer l'utilisateur authentifié depuis la base de données
        User currentUser = userRepository.findByUsername(currentUsername);
        if (currentUser == null) {
            // L'utilisateur authentifié n'a pas été trouvé dans la base de données
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        // Vérifier si l'utilisateur a le droit de mettre à jour cette image
        if (!currentUser.getId().equals(id) && !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"))) {
            // L'utilisateur n'essaye pas de mettre à jour sa propre image et n'est pas un administrateur
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Si l'utilisateur peut mettre à jour l'image, continuez le processus.
        try {
            MultipartFile imageFile = request.getFile("image");
            if (imageFile != null && !imageFile.isEmpty()) {
                byte[] imageData = imageFile.getBytes();
                String mimeType = imageFile.getContentType();
                // Utiliser le service pour mettre à jour l'image en fonction de la logique de l'application
                User updatedUser = userService.updateUserImage(id, imageData, mimeType);
                if (updatedUser == null) {
                    return ResponseEntity.notFound().build();
                }
                UserDTO userDTO = modelMapper.map(updatedUser, UserDTO.class);
                return ResponseEntity.ok(userDTO);
            } else {
                // Aucun fichier n'a été fourni avec la demande
                return ResponseEntity.badRequest().build();
            }
        } catch (IOException e) {
            // Exception lors de la lecture du fichier
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

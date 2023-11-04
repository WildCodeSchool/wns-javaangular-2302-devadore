package com.wcs.server.controller.auth;

import com.wcs.server.dto.ResetPasswordRequestDTO;
import com.wcs.server.entity.User;
import com.wcs.server.entity.UserLoginRequest;
import com.wcs.server.repository.UserRepository;
import com.wcs.server.security.JwtResponse;
import com.wcs.server.security.JwtTokenProvider;
import com.wcs.server.security.TokenRefreshRequest;
import com.wcs.server.service.UserService;
import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Operation(summary = "permet à l'utilisateur authentifié de recevoir un mail pour renouveller son pwd")
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean emailSent = userService.processForgotPassword(email);

        if (!emailSent) {
            // Utilisateur non trouvé
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("error", "Aucun compte n'est associé à cet e-mail. Vérifiez l'adresse et réessayez.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
        }

        // Utilisateur trouvé
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("message", "Si votre adresse e-mail est valide, nous vous enverrons un lien pour réinitialiser votre mot de passe.");
        return ResponseEntity.ok(responseMap);
    }

    @Operation(summary = "permet à l'utilisateur de renouveller son pwd")
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDTO request) {
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        if (jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsernameFromJWT(token);
            Optional<User> userOptional = Optional.ofNullable(userRepository.findByUsername(username));

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Mettre à jour le mot de passe de l'utilisateur
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);

                // Authentifier l'utilisateur avec le nouveau mot de passe
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                username,
                                newPassword
                        )
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Générer de nouveaux tokens d'accès et de rafraîchissement
                String accessToken = jwtTokenProvider.generateToken(authentication);
                String refreshToken = JwtTokenProvider.createRefreshToken(username);
                List<String> roles = authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList());

                // Invalider l'ancien token
                jwtTokenProvider.invalidate(token);

                return ResponseEntity.ok(new JwtResponse(accessToken, refreshToken, roles));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : L'utilisateur n'existe pas.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur : Token invalide ou expiré.");
        }
    }


    @Operation(summary = "permet d'authentifier un utilisateur par son username et mdp")
    @PostMapping("/authenticate")
    public ResponseEntity<JwtResponse> authenticateUser(@RequestBody UserLoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtTokenProvider.generateToken(authentication);
        String refreshToken = JwtTokenProvider.createRefreshToken(loginRequest.getUsername());
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(accessToken, refreshToken, roles));
    }

    @Operation(summary = "permet de rafraichir l'authentification - erreur 500????")
    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshAndGetAuthenticationToken(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        Claims claims = jwtTokenProvider.validateRefreshToken(requestRefreshToken);

        String username = claims.getSubject();
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        String accessToken = jwtTokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JwtResponse(accessToken, requestRefreshToken, roles));
    }

    @Operation(summary = "permet de se logout")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String accessToken) {
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring(7);
        }

        jwtTokenProvider.invalidate(accessToken);

        return ResponseEntity.ok().build();
    }

}


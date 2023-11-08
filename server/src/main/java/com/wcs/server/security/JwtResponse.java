package com.wcs.server.security;

import java.util.List;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private List<String> roles;
    private String message;
    private boolean success;

    // Constructeur pour la réponse de succès
    public JwtResponse(String token, String refreshToken, List<String> roles) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.roles = roles;
        this.success = true;
    }

    // Constructeur pour la réponse d'erreur
    public JwtResponse(String message) {
        this.message = message;
        this.success = false;
    }

    // Getters et setters pour tous les champs
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}

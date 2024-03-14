package com.wcs.server.dto;

public class RoleDTO {

    private Long id;

    private String name;

    public RoleDTO() {
        // pour des raisons de compatibilité avec JPA, qui nécessitent un constructeur par défaut.
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

package com.wcs.server.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "category")
public class Category {
    public Category(String name2) {
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String description;

<<<<<<< HEAD
    private LocalDate createdAt;
    private LocalDate updatedAt;
    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    
    
=======
    private Date createdAt;
    private Date updatedAt;

>>>>>>> 49c77608ca810b8363797583148ce9b161a1c2ff

}

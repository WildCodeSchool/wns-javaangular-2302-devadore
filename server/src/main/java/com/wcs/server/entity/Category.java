package com.wcs.server.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String description;

    private LocalDate createdAt;
    private LocalDate updatedAt;


}

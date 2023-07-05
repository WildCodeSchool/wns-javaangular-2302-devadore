package com.wcs.server.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private String description;

    private Date createdAt;
    private Date updatedAt;


}

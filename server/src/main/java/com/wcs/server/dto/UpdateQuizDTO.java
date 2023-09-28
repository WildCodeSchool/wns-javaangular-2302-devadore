package com.wcs.server.dto;

public class UpdateQuizDTO extends CreateQuizDTO {
    private Long id; // ID of the quiz to be updated

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}


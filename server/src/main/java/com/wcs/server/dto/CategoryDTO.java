package com.wcs.server.dto;

import java.util.List;

public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private List<QuizDTO> quizzes;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<QuizDTO> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(List<QuizDTO> quizzes) {
        this.quizzes = quizzes;
    }
}

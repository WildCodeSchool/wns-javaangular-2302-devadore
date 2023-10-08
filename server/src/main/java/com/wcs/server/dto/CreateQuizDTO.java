package com.wcs.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class CreateQuizDTO {

    private String title;
    private String description;
    @JsonProperty("categoryId")
    private Long categoryId; // Pour associer à une catégorie existante.
    private List<QuestionDTO> questions;
    private Long createdByUserId; // ID de l'utilisateur qui crée le quiz.

    private byte[] image;
    private String mimeType;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public List<QuestionDTO> getQuestions() {
        if (this.questions == null) {
            return new ArrayList<>();
        }
        return this.questions;

    }

    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }


    public static class QuestionDTO {
        private Long id;
        private String text;
        private List<AnswerDTO> answers;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public List<AnswerDTO> getAnswers() {
            return answers;
        }

        public void setAnswers(List<AnswerDTO> answers) {
            this.answers = answers;
        }


    }

    public static class AnswerDTO {
        private String text;
        private boolean isCorrect;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public boolean isCorrect() {
            return isCorrect;
        }

        public void setCorrect(boolean correct) {
            isCorrect = correct;
        }
    }

    @Override
    public String toString() {
        return "CreateQuizDTO{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", categoryId=" + categoryId +
                ", questions=" + questions +
                ", createdByUserId=" + createdByUserId +
                '}';
    }
}


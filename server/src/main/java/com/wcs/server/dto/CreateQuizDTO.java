package com.wcs.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class CreateQuizDTO {

    private String title;
    private String description;
    @JsonProperty("categoryId")
    private Long categoryId; // Pour associer à une catégorie existante.
    private List<QuestionDTO> questions;
    private Long createdByUserId; // ID de l'utilisateur qui crée le quiz.


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
        return questions;
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


    public static class QuestionDTO {
        private String text;
        private List<AnswerDTO> answers;

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

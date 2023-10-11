package com.wcs.server.dto;

import java.util.Date;
import java.util.List;

public class QuestionDTO {

    private Long id;
    private String text;
    private QuizDTO quiz;
    private Date createdAt;
    private Date updatedAt;
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
    public QuizDTO getQuiz() {
        return quiz;
    }
    public void setQuiz(QuizDTO quiz) {
        this.quiz = quiz;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    public Date getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    public List<AnswerDTO> getAnswers() {
        return answers;
    }
    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }
    
}

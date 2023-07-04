package com.wcs.server.dto;

import java.util.Date;

public class AnswerDTO {
    
    private Long id;
    private String text;
    private boolean isCorrect;
    private Date createdAt;
    private Date updateAt; 
    private QuestionDTO question;

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
    public Boolean getIsCorrect() {
        return isCorrect;
    }
    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    public Date getUpdateAt() {
        return updateAt;
    }
    public void setUpdateAt(Date updateAt) {
        this.updateAt = updateAt;
    }
    public QuestionDTO getQuestion() {
        return question;
    }
    public void setQuestion(QuestionDTO question) {
        this.question = question;
    }

    
}

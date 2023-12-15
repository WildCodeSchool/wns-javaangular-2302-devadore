package com.wcs.server.dto;

import java.sql.Date;

public class QuizAttemptDTO {
    
    private Long id;
    private Long userId;
    private QuizDTO quiz;
    private Integer scorePoints;
    private Integer correctAnswers;
    private Integer incorrectAnswers;
    private Date startTime;
    private Date endTime;
    private Integer totalTimeSpent;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Integer getScorePoints() {
        return scorePoints;
    }
    public void setScorePoints(Integer scorePoints) {
        this.scorePoints = scorePoints;
    }
    public Integer getCorrectAnswers() {
        return correctAnswers;
    }
    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }
    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }
    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }
    public Date getStartTime() {
        return startTime;
    }
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
    public Date getEndTime() {
        return endTime;
    }
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }
    public Integer getTotalTimeSpent() {
        return totalTimeSpent;
    }
    public void setTotalTimeSpent(Integer totalTimeSpent) {
        this.totalTimeSpent = totalTimeSpent;
    }
    public QuizDTO getQuiz() {
        return quiz;
    }
    public void setQuiz(QuizDTO quiz) {
        this.quiz = quiz;
    }
    
}

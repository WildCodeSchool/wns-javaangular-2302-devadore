package com.wcs.server.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wcs.server.dto.QuestionDTO;
import com.wcs.server.service.QuestionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Question")
@RequestMapping("/api")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/questions")
    @Operation(summary = "Retourne la liste de toutes les questions")
    public ResponseEntity<List<QuestionDTO>> getAll() {
        List<QuestionDTO> questions = questionService.getAll();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/question/quiz/{quizId}")
    @Operation(summary = "Retourne la liste des questions d'un quiz")
    public ResponseEntity<List<QuestionDTO>> getAllByQuizId(@PathVariable Long quizId) {
        List<QuestionDTO> questions = questionService.getQuestionsByQuizId(quizId);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/question/random/quiz/{quizId}")
    @Operation(summary = "Retourne une question aléatoire pour un quiz spécifié")
    public ResponseEntity<QuestionDTO> getRandomQuestionFromQuiz(@PathVariable Long quizId, @RequestParam(required = false) List<Long> excludeIds) {
        QuestionDTO randomQuestion = questionService.getRandomQuestionByQuizId(quizId, excludeIds);
        return ResponseEntity.ok(randomQuestion);
    }
}

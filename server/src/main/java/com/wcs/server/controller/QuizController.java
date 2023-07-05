package com.wcs.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wcs.server.dto.QuizDTO;
import com.wcs.server.entity.Quiz;
import com.wcs.server.service.QuizService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "Quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Operation(summary = "Retourne la liste de tous les quizs")
    @GetMapping("/quizs")
    public ResponseEntity<List<QuizDTO>> getAll() {
        List<QuizDTO> quizs = quizService.getAll();
        return ResponseEntity.ok(quizs);
    }

    @Operation(summary = "Retourne un quiz aléatoire")
    @GetMapping("/quiz/random")
    public ResponseEntity<QuizDTO> getRandomQuiz() {
        QuizDTO randomQuiz = quizService.getQuizByRandomId();
        return ResponseEntity.ok(randomQuiz);
    }
}

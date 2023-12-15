package com.wcs.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wcs.server.dto.QuizAttemptDTO;
import com.wcs.server.service.QuizAttemptService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "Quiz Attempt")
public class QuizAttemptController {

    @Autowired
    private QuizAttemptService quizAttemptService;

    @Operation(summary = "Créer une tentative de quiz")
    @PostMapping("/quizAttempt")
    public ResponseEntity<QuizAttemptDTO> createQuizAttempt(@RequestBody QuizAttemptDTO quizAttemptDTO) {
        QuizAttemptDTO createdQuizAttempt = quizAttemptService.createQuizAttempt(quizAttemptDTO);
        return ResponseEntity.ok(createdQuizAttempt);
    }

    @Operation(summary = "Récupère toutes les tentatives de quiz en fonction de l'utilisateur connecté")
    @GetMapping("/quizAttempt")
    public ResponseEntity<List<QuizAttemptDTO>> getAllQuizAttemptByUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<QuizAttemptDTO> quizAttemps = quizAttemptService.getAllQuizAttemptByUser(username);

        return ResponseEntity.ok(quizAttemps);
    }
    
}

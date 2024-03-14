package com.wcs.server.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wcs.server.dto.AnswerDTO;
import com.wcs.server.service.AnswerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "Answer")
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }


    @Operation(summary = "Retourne la liste des réponses d'une question")
    @GetMapping("/answer/question/{questionId}")
    public ResponseEntity<List<AnswerDTO>> getAllByQuiz(@PathVariable Long questionId) {
        List<AnswerDTO> answers = answerService.getAllByQuestionId(questionId);
        return ResponseEntity.ok(answers);
    }
}

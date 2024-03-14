package com.wcs.server.controller;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wcs.server.dto.CreateQuizDTO;
import com.wcs.server.dto.QuestionDTO;
import com.wcs.server.entity.User;
import com.wcs.server.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.wcs.server.dto.QuizDTO;
import com.wcs.server.service.QuizService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@RestController
@RequestMapping("/api")
@Tag(name = "Quiz")
public class QuizController {
    Logger logger = Logger.getLogger(getClass().getName());
    private final QuizService quizService;

    private final UserRepository userRepository;

    public QuizController(QuizService quizService, UserRepository userRepository) {
        this.quizService = quizService;
        this.userRepository = userRepository;
    }

    @Operation(summary = "Retourne la liste de tous les quizs")
    @GetMapping("/quiz")
    public ResponseEntity<List<QuizDTO>> getAll() {
        List<QuizDTO> quizs = quizService.getAll();
        return ResponseEntity.ok(quizs);
    }

    @Operation(summary = "Retourne un quiz aléatoire")
    @GetMapping("/quiz/random")
    public ResponseEntity<QuizDTO> getRandomQuiz() {
        QuizDTO randomQuiz = quizService.getQuizByRandomId();
        logger.info("request quiz random at controller");
        return ResponseEntity.ok(randomQuiz);
    }


     @Operation(summary = "Retourne un quiz aléatoire par catégorie")
    @GetMapping("/quiz/random/category/{categoryId}")
    public ResponseEntity<QuizDTO> getRandomQuizByCat(@PathVariable Long categoryId) {
        QuizDTO randomQuiz = quizService.getRandomQuizByCat(categoryId);
        System.out.println("request quiz random at controller");
        return ResponseEntity.ok(randomQuiz);
    } 


    @Operation(summary = "Retourne la liste quiz par userId")
    @GetMapping("/quiz/{userId}")
    public ResponseEntity<List<QuizDTO>> getQuizzesByUserId(@PathVariable User userId) {
        List<QuizDTO> quizzes = quizService.getQuizzesByUser(userId);
        return ResponseEntity.ok(quizzes);
    }

    @Operation(summary = "Retourne quiz par Id")
    @GetMapping("/quiz/show/{id}")
    public ResponseEntity<CreateQuizDTO> getQuizById(@PathVariable Long id) {
        Optional<CreateQuizDTO> quizOptional = quizService.findById(id);

        if (!quizOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(quizOptional.get(), HttpStatus.OK);
    }

    @Operation(summary = "permet de connaitre le total de question-quizID")
    @GetMapping("/quiz/{quizId}/totalQuestions")
    public ResponseEntity<Integer> getTotalQuestionsForQuiz(@PathVariable Long quizId) {
        int total = quizService.getTotalQuestionsByQuizId(quizId);
        return ResponseEntity.ok(total);
    }

    @Operation(summary = "Récupère toutes les questions pour un quiz spécifié par quizID")
    @GetMapping("/quiz/{quizId}/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestionsForQuiz(@PathVariable Long quizId) {
        List<QuestionDTO> questions = quizService.getAllQuestionsByQuizId(quizId);
        return ResponseEntity.ok(questions);
    }

    @Operation(summary = "permet à un utilisateur de créer un quiz")
    @PostMapping("/quiz")
    public ResponseEntity<String> createQuiz(
            MultipartHttpServletRequest request,
            Authentication authentication) {
        try {
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            Long categoryId = Long.valueOf(request.getParameter("categoryId"));
            MultipartFile image = request.getFile("image");
            String mimeType = request.getParameter("mimeType");


            byte[] imageData = null;
            if (image != null && !image.isEmpty()) {
                imageData = image.getBytes();
            }

            String questionsJson = request.getParameter("questions");
            ObjectMapper objectMapper = new ObjectMapper();
            List<CreateQuizDTO.QuestionDTO> questionList = objectMapper.readValue(questionsJson, new TypeReference<>() {
            });
            CreateQuizDTO createQuizDTO = new CreateQuizDTO();
            createQuizDTO.setTitle(title);
            createQuizDTO.setDescription(description);
            createQuizDTO.setQuestions(questionList);
            createQuizDTO.setCategoryId(categoryId);
            createQuizDTO.setImage(imageData);
            createQuizDTO.setMimeType(mimeType);

            QuizDTO quizDTO = quizService.createCompleteQuiz(createQuizDTO, authentication);
            if (quizDTO != null) {
                return ResponseEntity.ok().body("{\"message\": \"Quiz registered successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Quiz registration failed\"}");
            }
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Invalid questions format\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"An error occurred during registration\"}");
        }
    }

    @Operation(summary = "permet de mettre à jour un quiz par son ID")
    @PutMapping("/quiz/{id}")
    public ResponseEntity<String> updateQuiz(@PathVariable Long id, MultipartHttpServletRequest request) {
        try {
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            Long categoryId = Long.valueOf(request.getParameter("categoryId"));
            MultipartFile image = request.getFile("image");
            String mimeType = request.getParameter("mimeType");


            byte[] imageData = null;
            if (image != null && !image.isEmpty()) {
                imageData = image.getBytes();
            }

            String questionsJson = request.getParameter("questions");
            ObjectMapper objectMapper = new ObjectMapper();
            List<CreateQuizDTO.QuestionDTO> questionList = objectMapper.readValue(questionsJson, new TypeReference<>() {
            });
            CreateQuizDTO createQuizDTO = new CreateQuizDTO();
            createQuizDTO.setTitle(title);
            createQuizDTO.setDescription(description);
            createQuizDTO.setQuestions(questionList);
            createQuizDTO.setCategoryId(categoryId);
            createQuizDTO.setImage(imageData);
            createQuizDTO.setMimeType(mimeType);

            QuizDTO quizDTO = quizService.updateQuiz(id, createQuizDTO);
            if (quizDTO != null) {
                return ResponseEntity.ok().body("{\"message\": \"Quiz registered successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Quiz registration failed\"}");
            }
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Invalid questions format\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"An error occurred during registration\"}");
        }
    }

    @GetMapping("/quiz/{quizId}/can-edit")
    public ResponseEntity<?> canUserEditQuiz(@PathVariable Long quizId, Authentication authentication) {
        boolean canEdit = quizService.canUserEditQuiz(quizId, authentication);
        return ResponseEntity.ok(canEdit);
    }

    @DeleteMapping("/quiz/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id, Authentication authentication) {
        // Récupération et affectation de l'utilisateur (créateur du quiz)
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        User user = userRepository.findByUsername(username);
        quizService.deleteQuiz(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

}

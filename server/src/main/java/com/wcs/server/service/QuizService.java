package com.wcs.server.service;


import java.util.*;
import java.util.stream.Collectors;

import com.wcs.server.dto.CreateQuizDTO;
import com.wcs.server.entity.*;
import com.wcs.server.errormessage.ResourceNotFoundException;
import com.wcs.server.errormessage.UnauthorizedException;
import com.wcs.server.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.wcs.server.dto.QuizDTO;


@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    public List<QuizDTO> getAll() {
        List<Quiz> quizs = quizRepository.findAll();
        return quizs.stream()
                .map(this::convertQuizToDTO)
                .collect(Collectors.toList());
    }

    public QuizDTO getQuizByRandomId() {
        List<Integer> ids = quizRepository.findAllIds();

        // nextInt(n) genère un nombre aléatoire entre 0 inclus et n exclus
        // Ce qui permet de récupérer un index aléatoire de la liste et retourner son id
    
        Random random = new Random();
        int randomId = ids.get(random.nextInt(ids.size()));

        Quiz quiz = quizRepository.findById(randomId)
                .orElseThrow(() -> new NoSuchElementException("Le quiz avec l'id " + randomId + " n'existe pas ou n'est pas trouvé"));

        return convertQuizToDTO(quiz);
    }

    public List<QuizDTO> getQuizzesByUser(User userId) {
        List<Quiz> quizzes = quizRepository.findQuizzesByCreatedBy(userId);
        return quizzes.stream()
                .map(quiz -> modelMapper.map(quiz, QuizDTO.class))
                .collect(Collectors.toList());
    }

    public Optional<CreateQuizDTO> findById(Long id) {
        Optional<Quiz> quizOptional = quizRepository.findById(Math.toIntExact(id));
        if (quizOptional.isEmpty()) {
            return Optional.empty();
        }
        CreateQuizDTO quizDTO = modelMapper.map(quizOptional.get(), CreateQuizDTO.class);
        return Optional.of(quizDTO);
    }

    public QuizDTO createCompleteQuiz(CreateQuizDTO createQuizDTO, Authentication authentication) {

        // Obtenir une catégorie existante à l'aide de l'ID
        Category category = getCategory(createQuizDTO.getCategoryId());

        // Créer et sauvegarder l'entité Quiz
        Quiz quiz = createAndSaveQuiz(createQuizDTO, category, authentication);

        // Traiter et enregistrer les questions
        saveQuestions(createQuizDTO.getQuestions(), quiz);

        return modelMapper.map(quiz, QuizDTO.class);
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NoSuchElementException("Catégorie avec ID " + categoryId + " non trouvée"));
    }

    private Quiz createAndSaveQuiz(CreateQuizDTO createQuizDTO, Category category, Authentication authentication) {
        Quiz quiz = new Quiz();
        quiz.setTitle(createQuizDTO.getTitle());
        quiz.setDescription(createQuizDTO.getDescription());
        quiz.setCategory(category);
        setUserAndImage(quiz, createQuizDTO, authentication);
        return quizRepository.save(quiz);
    }

    private void setUserAndImage(Quiz quiz, CreateQuizDTO createQuizDTO, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername());
        quiz.setCreatedBy(user);
        if (createQuizDTO.getImage() != null) {
            setImage(quiz, createQuizDTO);
        }
    }

    private void setImage(Quiz quiz, CreateQuizDTO createQuizDTO) {
        Image image = new Image();
        image.setName(createQuizDTO.getTitle() + "_image");
        image.setImage(createQuizDTO.getImage());
        image.setMimeType(createQuizDTO.getMimeType());
        image.setQuiz(quiz);
        quiz.setImage(image);
    }

    private void saveQuestions(List<CreateQuizDTO.QuestionDTO> questionDTOs, Quiz quiz) {
        List<Question> quizQuestions = new ArrayList<>();
        for (CreateQuizDTO.QuestionDTO questionDTO : questionDTOs) {
            Question question = new Question();
            question.setText(questionDTO.getText());
            question.setQuiz(quiz);
            setAnswers(question, questionDTO.getAnswers());
            quizQuestions.add(question);
        }
        questionRepository.saveAll(quizQuestions);
    }

    private void setAnswers(Question question, List<CreateQuizDTO.AnswerDTO> answerDTOs) {
        List<Answer> questionAnswers = answerDTOs.stream().map(answerDTO -> {
            Answer answer = new Answer();
            answer.setText(answerDTO.getText());
            answer.setIsCorrect(answerDTO.isCorrect());
            answer.setQuestion(question);
            return answer;
        }).collect(Collectors.toList());
        question.setAnswers(questionAnswers);
    }

    private QuizDTO convertQuizToDTO(Quiz quiz) {
        System.out.println("request quiz random at DTO");
        return modelMapper.map(quiz, QuizDTO.class);
    }


    public QuizDTO updateQuiz(Long id, CreateQuizDTO createQuizDTO) {
        // Trouver le quiz existant par ID
        Quiz quiz = quizRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new NoSuchElementException("Quiz avec l'id " + id + " n'est pas trouvé"));

        // Mettre à jour les propriétés du quiz
        updateQuizProperties(quiz, createQuizDTO);

        // Mise à jour des questions
        List<Question> existingQuestions = questionRepository.findAllByQuizId(id);
        updateQuestions(quiz, createQuizDTO.getQuestions(), existingQuestions);

        // Sauvegarde de l'entité Quiz mise à jour
        quiz = quizRepository.save(quiz);

        return modelMapper.map(quiz, QuizDTO.class);
    }

    private void updateQuizProperties(Quiz quiz, CreateQuizDTO createQuizDTO) {
        quiz.setTitle(createQuizDTO.getTitle());
        quiz.setDescription(createQuizDTO.getDescription());

        // Récupération de la catégorie existante en utilisant l'ID
        Category category = categoryRepository.findById(createQuizDTO.getCategoryId())
                .orElseThrow(() -> new NoSuchElementException("Catégorie avec l'id " + createQuizDTO.getCategoryId() + " n'est pas trouvée"));
        quiz.setCategory(category);

        // Mettre à jour l'image si une nouvelle est fournie
        if (createQuizDTO.getImage() != null) {
            Image image = new Image();
            image.setName(createQuizDTO.getTitle() + "_image");
            image.setImage(createQuizDTO.getImage());
            image.setMimeType(createQuizDTO.getMimeType());
            image.setQuiz(quiz);
            quiz.setImage(image);
        }
    }

    private void updateQuestions(Quiz quiz, List<CreateQuizDTO.QuestionDTO> questionDTOs, List<Question> existingQuestions) {
        List<Question> updatedQuestions = new ArrayList<>();

        for (CreateQuizDTO.QuestionDTO questionDTO : questionDTOs) {
            Question question = existingQuestions.stream()
                    .filter(q -> q.getId().equals(questionDTO.getId()))
                    .findFirst()
                    .orElseGet(() -> new Question());

            question.setText(questionDTO.getText());
            question.setQuiz(quiz);

            // Mettez à jour ou ajoutez les réponses
            List<Answer> updatedAnswers = questionDTO.getAnswers().stream().map(answerDTO -> {
                Answer answer = new Answer();
                answer.setText(answerDTO.getText());
                answer.setIsCorrect(answerDTO.isCorrect());
                answer.setQuestion(question);
                return answer;
            }).collect(Collectors.toList());

            question.setAnswers(updatedAnswers);
            updatedQuestions.add(question);
        }

        // Supprimer les questions qui ne sont plus nécessaires
        existingQuestions.removeAll(updatedQuestions);
        questionRepository.deleteAll(existingQuestions);

        // Sauvegarde des questions mises à jour
        questionRepository.saveAll(updatedQuestions);
    }

    public void deleteQuiz(Long quizId, String username) {
        Quiz quiz = quizRepository.findById(Math.toIntExact(quizId)).orElseThrow(() -> new ResourceNotFoundException("Quiz non trouvé"));
        if (!quiz.getCreatedBy().getUsername().equals(username)) {
            throw new UnauthorizedException("Seul le créateur peut supprimer ce quiz");
        }
        quizRepository.delete(quiz);
    }

    public int getTotalQuestionsByQuizId(Long quizId) {
        return questionRepository.countByQuizId(quizId);
    }

    public boolean canUserEditQuiz(Long quizId, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User currentUser = userRepository.findByUsername(userDetails.getUsername());

        Quiz quiz = quizRepository.findById(Math.toIntExact(quizId))
                .orElseThrow(() -> new ResourceNotFoundException("Quiz avec id " + quizId + " non trouvé"));

        return quiz.getCreatedBy().equals(currentUser);
    }
}



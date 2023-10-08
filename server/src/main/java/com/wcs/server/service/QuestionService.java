package com.wcs.server.service;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wcs.server.dto.QuestionDTO;
import com.wcs.server.entity.Question;
import com.wcs.server.repository.QuestionRepository;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<QuestionDTO> getAll() {
        List<Question> questions = questionRepository.findAll();
        return questions.stream()
                .map(this::convertQuestionToDTO)
                .collect(Collectors.toList());
    }

    public List<QuestionDTO> getQuestionsByQuizId(Long id) {
        List<Question> questions = questionRepository.findAllByQuizId(id);
        return questions.stream()
                .map(this::convertQuestionToDTO)
                .collect(Collectors.toList());
    }

    public QuestionDTO getRandomQuestionByQuizId(Long quizId, List<Long> excludeIds) {

        // Valeur par défaut de excludeIds obligatoire sinon la requête du repo ne passe pas
        if (excludeIds == null || excludeIds.isEmpty()) {
            excludeIds = Collections.singletonList(-1L);
        }

        Question randomQuestion = questionRepository.getRandomQuestionByQuizIdExcluding(quizId, excludeIds);
        if (randomQuestion == null) {
            throw new NoSuchElementException("Aucune question trouvée pour le quiz avec l'id " + quizId);
        }

        return convertQuestionToDTO(randomQuestion);
    }


    private QuestionDTO convertQuestionToDTO(Question question) {
        QuestionDTO questionDTO = modelMapper.map(question, QuestionDTO.class);
        return questionDTO;
    }

}

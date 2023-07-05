package com.wcs.server.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wcs.server.dto.QuizDTO;
import com.wcs.server.entity.Quiz;
import com.wcs.server.repository.QuizRepository;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

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

    private QuizDTO convertQuizToDTO(Quiz quiz) {
        return modelMapper.map(quiz, QuizDTO.class);
    }
}

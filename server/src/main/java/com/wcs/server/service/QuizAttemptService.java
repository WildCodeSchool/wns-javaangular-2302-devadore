package com.wcs.server.service;

import com.wcs.server.dto.QuizAttemptDTO;
import com.wcs.server.entity.Quiz;
import com.wcs.server.entity.QuizAttempt;
import com.wcs.server.entity.User;
import com.wcs.server.errormessage.ResourceNotFoundException;
import com.wcs.server.repository.QuizAttemptRepository;
import com.wcs.server.repository.QuizRepository;
import com.wcs.server.repository.UserRepository;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;
    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;

    private QuizAttemptDTO convertToDto(QuizAttempt quizAttempt) {
        return modelMapper.map(quizAttempt, QuizAttemptDTO.class);
    }

    private QuizAttempt convertToEntity(QuizAttemptDTO quizAttemptDTO){
        return modelMapper.map(quizAttemptDTO, QuizAttempt.class);
    }

    public QuizAttemptDTO createQuizAttempt(QuizAttemptDTO quizAttemptDTO) {
        QuizAttempt quizAttempt = convertToEntity(quizAttemptDTO);

        Quiz quiz = quizRepository.findById(quizAttemptDTO.getQuiz().getId())
                                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        User user = userRepository.findById(quizAttemptDTO.getUserId())
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        quizAttempt.setQuiz(quiz);
        quizAttempt.setUser(user);

        quizAttempt = quizAttemptRepository.save(quizAttempt);

        return convertToDto(quizAttempt);
    }

    public List<QuizAttemptDTO> getAllQuizAttemptByUser(String username) {
        
        Long userId = userRepository.findByUsername(username).getId();
        List<QuizAttempt> quizAttempts = quizAttemptRepository.findAllByUserId(userId);

        return quizAttempts.stream().map(this::convertToDto).toList();
    }
}

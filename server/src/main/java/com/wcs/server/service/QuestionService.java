package com.wcs.server.service;

import java.util.List;
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

    public List<QuestionDTO> getAll(){
        List<Question> questions = questionRepository.findAll();
        return questions.stream()
            .map(this::convertQuestionToDTO)
            .collect(Collectors.toList());
    }

    public List<QuestionDTO> getQuestionsByQuizId(Long id){
        List<Question> questions = questionRepository.findAllByQuizId(id);
        return questions.stream()
            .map(this::convertQuestionToDTO)
            .collect(Collectors.toList());
    }

    private QuestionDTO convertQuestionToDTO(Question question) {
        return modelMapper.map(question, QuestionDTO.class);
    }

}

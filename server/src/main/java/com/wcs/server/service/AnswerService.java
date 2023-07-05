package com.wcs.server.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wcs.server.dto.AnswerDTO;
import com.wcs.server.dto.QuestionDTO;
import com.wcs.server.entity.Answer;
import com.wcs.server.entity.Question;
import com.wcs.server.repository.AnswerRepository;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired 
    private ModelMapper modelMapper;

    public List<AnswerDTO> getAllByQuestionId(Long id){
        List<Answer> answers = answerRepository.findAllByQuestionId(id);
        return answers.stream()
            .map(this::convertQuestionToDTO)
            .collect(Collectors.toList());
    }

    private AnswerDTO convertQuestionToDTO(Answer answer) {
        return modelMapper.map(answer, AnswerDTO.class);
    }
}

package com.wcs.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wcs.server.entity.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long>{
    List<Answer> findAllByQuestionId(Long id);
}

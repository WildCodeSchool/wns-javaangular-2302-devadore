package com.wcs.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wcs.server.entity.Question;

public interface QuestionRepository extends JpaRepository<Question, Long>{

    List<Question> findAllByQuizId(Long id);
}

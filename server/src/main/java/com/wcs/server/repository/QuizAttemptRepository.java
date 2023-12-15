package com.wcs.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wcs.server.entity.QuizAttempt;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long>{
    List<QuizAttempt> findAllByUserId(Long id);
}

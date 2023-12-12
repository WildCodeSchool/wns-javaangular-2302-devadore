package com.wcs.server.repository;

import com.wcs.server.entity.Quiz;
import com.wcs.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCreatedBy(User user);

    List<Quiz> findQuizzesByCreatedBy(User user);

    @Query("SELECT id FROM Quiz")
    List<Long> findAllIds();
}

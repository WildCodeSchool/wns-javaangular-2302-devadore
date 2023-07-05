package com.wcs.server.repository;

import com.wcs.server.entity.Quiz;
import com.wcs.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizRepository extends JpaRepository< Quiz, Integer> {
    List<Quiz> findByCreatedBy(User user);

    @Query("SELECT id FROM Quiz")
    List<Integer> findAllIds();
}

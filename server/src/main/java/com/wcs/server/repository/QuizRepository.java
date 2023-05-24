package com.wcs.server.repository;

import com.wcs.server.entity.Quiz;
import com.wcs.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository< Quiz, Long> {
    List<Quiz> findByCreatedBy(User user);
}

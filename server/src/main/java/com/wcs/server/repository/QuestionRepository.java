package com.wcs.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wcs.server.entity.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findAllByQuizId(Long id);

    @Query(value = "SELECT * FROM question WHERE quiz_id = :quizId AND id NOT IN (:excludeIds) ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Question getRandomQuestionByQuizIdExcluding(@Param("quizId") Long quizId, @Param("excludeIds") List<Long> excludeIds);


    int countByQuizId(Long quizId);
}

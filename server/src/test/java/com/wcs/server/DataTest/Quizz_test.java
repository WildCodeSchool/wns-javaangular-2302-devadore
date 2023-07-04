package com.wcs.server.DataTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.wcs.server.ServerApplication;
import com.wcs.server.configuration.ApplicationConfig;
import com.wcs.server.configuration.ApplicationTestConfig;
import com.wcs.server.entity.Quiz;
import com.wcs.server.repository.QuizRepository;
import com.wcs.server.security.SecurityConfig;

@DataJpaTest
@Import(ApplicationTestConfig.class)
@EnableAutoConfiguration(exclude= {WebMvcAutoConfiguration.class, ApplicationConfig.class, SecurityConfig.class, ServerApplication.class})
public class Quizz_test {
    
    @Autowired
    QuizRepository QuizRepository;

    @Test
    public void testCreateQuiz() {
        String title = "Quiz1";
        var quiz = new Quiz(title);

        QuizRepository.saveAndFlush(quiz);

        Optional<Quiz> fromDB = QuizRepository.findById(quiz.getId());

        assertTrue(fromDB.isPresent());
        assertEquals(quiz.getId(), fromDB.get().getId());
        assertEquals(quiz.getTitle(), fromDB.get().getTitle()); 
    }


}

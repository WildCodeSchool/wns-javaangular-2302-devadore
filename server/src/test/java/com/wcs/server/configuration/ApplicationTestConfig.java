package com.wcs.server.configuration;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.thymeleaf.spring6.SpringTemplateEngine;


@TestConfiguration
public class ApplicationTestConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        return Mockito.mock(JavaMailSender.class);
    }

    @Bean
    public SpringTemplateEngine templateEngine() {
        return Mockito.mock(SpringTemplateEngine.class);
    }
}

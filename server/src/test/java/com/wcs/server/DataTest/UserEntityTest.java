package com.wcs.server.DataTest;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.wcs.server.ServerApplication;
import com.wcs.server.configuration.ApplicationConfig;
import com.wcs.server.security.SecurityConfig;

@DataJpaTest
@EnableAutoConfiguration(exclude= {WebMvcAutoConfiguration.class, ApplicationConfig.class, SecurityConfig.class, ServerApplication.class})
public class UserEntityTest {
    
}

package com.wcs.server.DataTest;

import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.wcs.server.configuration.ApplicationTestConfig;

@DataJpaTest
@Import(ApplicationTestConfig.class)
public class UserEntityTest {
    
}

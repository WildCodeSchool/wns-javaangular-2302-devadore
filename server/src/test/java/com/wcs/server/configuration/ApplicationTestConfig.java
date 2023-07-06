package com.wcs.server.configuration;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.boot.test.context.TestConfiguration;



@TestConfiguration
@EnableAutoConfiguration(exclude= WebMvcAutoConfiguration.class)
public class ApplicationTestConfig {
/* 
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.createTypeMap(RoleDTO.class, Role.class);

        return modelMapper;
    } */

/*     @Bean(name = "mvcHandlerMappingIntrospector")
    public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
        return new HandlerMappingIntrospector();
    }  */
}

package com.wcs.server.configuration;

import org.atmosphere.cpr.AtmosphereFramework;
import org.atmosphere.cpr.AtmosphereServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSocketConfig {

    @Bean
    public AtmosphereServlet atmosphereServlet() {
        return new AtmosphereServlet();
    }

    @Bean
    public ServletRegistrationBean<AtmosphereServlet> atmosphereServletRegistration() {
        ServletRegistrationBean<AtmosphereServlet> registration = new ServletRegistrationBean<>(atmosphereServlet(),
                "/websocket/*");
        registration.addInitParameter("org.atmosphere.cpr.packages", "com.wcs.server.websocket");
        registration.setLoadOnStartup(0);
        registration.setAsyncSupported(true);
        return registration;
    }

    @Bean
    public AtmosphereFramework atmosphereFramework() {
        return atmosphereServlet().framework();
    }
}

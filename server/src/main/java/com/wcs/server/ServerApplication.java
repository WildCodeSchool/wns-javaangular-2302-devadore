package com.wcs.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({
        "com.wcs.server.controller",
        "com.wcs.server.security",
        "com.wcs.server.service",
        "com.wcs.server.repository",
        "com.wcs.server.configuration"
})
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

}

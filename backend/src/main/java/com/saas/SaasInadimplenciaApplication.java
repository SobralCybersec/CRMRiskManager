package com.saas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SaasInadimplenciaApplication {
    public static void main(String[] args) {
        SpringApplication.run(SaasInadimplenciaApplication.class, args);
    }
}
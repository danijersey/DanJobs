package com.jobpilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DanJobsApplication {

    public static void main(String[] args) {
        SpringApplication.run(DanJobsApplication.class, args);
    }
}
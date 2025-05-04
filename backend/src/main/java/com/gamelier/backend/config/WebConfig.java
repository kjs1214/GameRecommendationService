package com.gamelier.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // 모든 API 경로 허용
                        .allowedOrigins("http://localhost:5173") // Vite 개발 서버 주소
                        .allowedMethods("*") // GET, POST 등 모두 허용
                        .allowCredentials(true); // 세션 쿠키 전송 허용
            }
        };
    }
}

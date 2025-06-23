package com.gamelier.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class GamelierBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GamelierBackendApplication.class, args);
	}

}

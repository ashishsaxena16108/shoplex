package com.shoplex.shopex_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ShopexBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopexBackendApplication.class, args);
	}

}

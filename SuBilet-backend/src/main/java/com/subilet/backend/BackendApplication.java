package com.subilet.backend; // Senin paket ismin

import org.springframework.boot.SpringApplication; // <-- BU SATIR EKSİK OLABİLİR
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(BackendApplication.class, args);
	}

}
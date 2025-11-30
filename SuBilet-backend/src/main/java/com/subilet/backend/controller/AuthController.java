package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Admin;
import com.subilet.backend.entity.Customer;
import com.subilet.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Customer Register
    @PostMapping("/register/customer")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerCustomer(@RequestBody Customer customer) {
        try {
            Map<String, Object> result = authService.registerCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Kayıt başarılı. Hoş geldiniz!", result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Admin Register
    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerAdmin(@RequestBody Admin admin) {
        try {
            Map<String, Object> result = authService.registerAdmin(admin);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Kayıt başarılı. Hoş geldiniz!", result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Customer Login
    @PostMapping("/login/customer")
    public ResponseEntity<ApiResponse<Map<String, Object>>> loginCustomer(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            Map<String, Object> result = authService.loginCustomer(username, password);
            return ResponseEntity.ok(ApiResponse.success("Giriş başarılı. Hoş geldiniz!", result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Admin Login
    @PostMapping("/login/admin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> loginAdmin(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            Map<String, Object> result = authService.loginAdmin(username, password);
            return ResponseEntity.ok(ApiResponse.success("Giriş başarılı. Hoş geldiniz!", result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Token Validation
    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Map<String, Object> result = authService.validateToken(token);
            return ResponseEntity.ok(ApiResponse.success("Token geçerli", result));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // Logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            authService.logout(token);
            return ResponseEntity.ok(ApiResponse.success("Çıkış yapıldı", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}


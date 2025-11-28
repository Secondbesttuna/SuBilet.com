package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Admin;
import com.subilet.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Admin>> login(@RequestBody Admin loginRequest) {
        return adminService.login(loginRequest.getUsername(), loginRequest.getPassword())
                .map(admin -> ResponseEntity.ok(ApiResponse.success("Giriş başarılı. Hoş geldiniz, " + admin.getFullName(), admin)))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Kullanıcı adı veya şifre hatalı")));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Admin>> register(@RequestBody Admin admin) {
        Admin created = adminService.createAdmin(admin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Admin kullanıcısı başarıyla oluşturuldu", created));
    }
}
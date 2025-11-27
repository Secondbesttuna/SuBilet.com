package com.subilet.backend.controller;

import com.subilet.backend.entity.Admin;
import com.subilet.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    // Basit Login Kontrolü
    // React'ten kullanıcı adı ve şifre gelecek, doğru mu diye bakacağız.
    @PostMapping("/login")
    public Admin login(@RequestBody Admin loginRequest) {
        Admin admin = adminRepository.findByUsername(loginRequest.getUsername());
        
        if (admin != null && admin.getPassword().equals(loginRequest.getPassword())) {
            return admin; // Giriş Başarılı, admin bilgilerini dön
        }
        return null; // Giriş Başarısız
    }
}
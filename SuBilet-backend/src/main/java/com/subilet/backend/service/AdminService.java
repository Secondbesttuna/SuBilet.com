package com.subilet.backend.service;

import com.subilet.backend.entity.Admin;
import com.subilet.backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Optional<Admin> login(String username, String password) {
        Admin admin = adminRepository.findByUsername(username);
        if (admin != null && admin.getPassword().equals(password)) {
            return Optional.of(admin);
        }
        return Optional.empty();
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Optional<Admin> findByUsername(String username) {
        return Optional.ofNullable(adminRepository.findByUsername(username));
    }
}




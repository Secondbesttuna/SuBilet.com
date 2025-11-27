package com.subilet.backend.repository;

import com.subilet.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    // Giriş yaparken kullanıcı adına göre admini bulmak için özel metod
    Admin findByUsername(String username);
}
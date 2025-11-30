package com.subilet.backend.service;

import com.subilet.backend.entity.Admin;
import com.subilet.backend.entity.Customer;
import com.subilet.backend.entity.Session;
import com.subilet.backend.repository.AdminRepository;
import com.subilet.backend.repository.CustomerRepository;
import com.subilet.backend.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private SessionRepository sessionRepository;

    // Customer Register
    @Transactional
    public Map<String, Object> registerCustomer(Customer customer) {
        // Username kontrolü
        if (customer.getUsername() == null || customer.getUsername().isEmpty()) {
            throw new RuntimeException("Kullanıcı adı boş olamaz");
        }
        if (customerRepository.findByUsername(customer.getUsername()).isPresent()) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor");
        }

        // Mail kontrolü
        if (customer.getMail() != null && !customer.getMail().isEmpty()) {
            if (customerRepository.findByMail(customer.getMail()).isPresent()) {
                throw new RuntimeException("Bu e-posta adresi ile zaten kayıtlı bir kullanıcı var");
            }
        }

        // TC No kontrolü (opsiyonel ama unique olmalı)
        if (customer.getTcNo() != null && !customer.getTcNo().isEmpty()) {
            if (customerRepository.findByTcNo(customer.getTcNo()).isPresent()) {
                throw new RuntimeException("Bu TC Kimlik No ile zaten kayıtlı bir kullanıcı var");
            }
        }

        // Password kontrolü
        if (customer.getPassword() == null || customer.getPassword().isEmpty()) {
            throw new RuntimeException("Şifre boş olamaz");
        }

        Customer saved = customerRepository.save(customer);
        String token = createSession(saved.getUserId(), "CUSTOMER");

        Map<String, Object> response = new HashMap<>();
        response.put("user", saved);
        response.put("token", token);
        response.put("userType", "CUSTOMER");
        return response;
    }

    // Admin Register
    @Transactional
    public Map<String, Object> registerAdmin(Admin admin) {
        // Username kontrolü
        if (adminRepository.findByUsername(admin.getUsername()) != null) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor");
        }

        // Password kontrolü
        if (admin.getPassword() == null || admin.getPassword().isEmpty()) {
            throw new RuntimeException("Şifre boş olamaz");
        }

        Admin saved = adminRepository.save(admin);
        String token = createSession(saved.getAdminId(), "ADMIN");

        Map<String, Object> response = new HashMap<>();
        response.put("user", saved);
        response.put("token", token);
        response.put("userType", "ADMIN");
        return response;
    }

    // Customer Login
    @Transactional
    public Map<String, Object> loginCustomer(String username, String password) {
        Optional<Customer> customerOpt = customerRepository.findByUsername(username);
        
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("Kullanıcı adı veya şifre hatalı");
        }

        Customer customer = customerOpt.get();
        if (!customer.getPassword().equals(password)) {
            throw new RuntimeException("Kullanıcı adı veya şifre hatalı");
        }

        // Eski oturumları devre dışı bırak
        sessionRepository.deactivateUserSessions(customer.getUserId(), "CUSTOMER");

        String token = createSession(customer.getUserId(), "CUSTOMER");

        Map<String, Object> response = new HashMap<>();
        response.put("user", customer);
        response.put("token", token);
        response.put("userType", "CUSTOMER");
        return response;
    }

    // Admin Login
    @Transactional
    public Map<String, Object> loginAdmin(String username, String password) {
        Admin admin = adminRepository.findByUsername(username);
        
        if (admin == null) {
            throw new RuntimeException("Kullanıcı adı veya şifre hatalı");
        }

        if (!admin.getPassword().equals(password)) {
            throw new RuntimeException("Kullanıcı adı veya şifre hatalı");
        }

        // Eski oturumları devre dışı bırak
        sessionRepository.deactivateUserSessions(admin.getAdminId(), "ADMIN");

        String token = createSession(admin.getAdminId(), "ADMIN");

        Map<String, Object> response = new HashMap<>();
        response.put("user", admin);
        response.put("token", token);
        response.put("userType", "ADMIN");
        return response;
    }

    // Token doğrulama
    public Map<String, Object> validateToken(String token) {
        Optional<Session> sessionOpt = sessionRepository.findByTokenAndIsActiveTrue(token);
        
        if (sessionOpt.isEmpty()) {
            throw new RuntimeException("Geçersiz veya süresi dolmuş token");
        }

        Session session = sessionOpt.get();
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            session.setIsActive(false);
            sessionRepository.save(session);
            throw new RuntimeException("Token süresi dolmuş");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("userId", session.getUserId());
        response.put("userType", session.getUserType());
        response.put("valid", true);
        return response;
    }

    // Logout
    @Transactional
    public void logout(String token) {
        Optional<Session> sessionOpt = sessionRepository.findByTokenAndIsActiveTrue(token);
        sessionOpt.ifPresent(session -> {
            session.setIsActive(false);
            sessionRepository.save(session);
        });
    }

    // Session oluşturma
    private String createSession(Integer userId, String userType) {
        String token = generateToken();
        
        Session session = new Session();
        session.setToken(token);
        session.setUserId(userId);
        session.setUserType(userType);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusDays(7)); // 7 gün geçerli
        session.setIsActive(true);
        
        sessionRepository.save(session);
        return token;
    }

    // Token üretme
    private String generateToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}


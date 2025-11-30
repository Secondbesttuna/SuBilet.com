package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "session")
public class Session {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Integer sessionId;
    
    @Column(name = "token", unique = true, nullable = false)
    private String token;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "user_type", nullable = false)
    private String userType; // "CUSTOMER" veya "ADMIN"
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}


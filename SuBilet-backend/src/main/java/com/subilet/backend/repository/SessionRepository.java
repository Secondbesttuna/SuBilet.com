package com.subilet.backend.repository;

import com.subilet.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Integer> {
    
    Optional<Session> findByTokenAndIsActiveTrue(String token);
    
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Session s SET s.isActive = false WHERE s.userId = :userId AND s.userType = :userType")
    void deactivateUserSessions(@Param("userId") Integer userId, @Param("userType") String userType);
}


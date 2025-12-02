package com.subilet.backend.security;

import com.subilet.backend.entity.Session;
import com.subilet.backend.repository.SessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

/**
 * Her HTTP isteğinde Authorization header'ındaki token'ı kontrol eder.
 * Geçerli token varsa, kullanıcıyı Spring Security context'ine ekler.
 */
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final SessionRepository sessionRepository;

    public TokenAuthenticationFilter(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // "Bearer " kısmını çıkar
            
            try {
                Optional<Session> sessionOpt = sessionRepository.findByTokenAndIsActiveTrue(token);
                
                if (sessionOpt.isPresent()) {
                    Session session = sessionOpt.get();
                    
                    // Token süresi dolmuş mu kontrol et
                    if (session.getExpiresAt().isAfter(LocalDateTime.now())) {
                        // Kullanıcı tipine göre yetki ata
                        String role = "ROLE_" + session.getUserType(); // ROLE_CUSTOMER veya ROLE_ADMIN
                        
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                session.getUserId(),  // principal: userId
                                null,                 // credentials
                                Collections.singletonList(new SimpleGrantedAuthority(role))
                            );
                        
                        // Kullanıcı bilgilerini authentication'a ekle
                        authentication.setDetails(new TokenUserDetails(
                            session.getUserId(),
                            session.getUserType(),
                            token
                        ));
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        // Token süresi dolmuş, deaktive et
                        session.setIsActive(false);
                        sessionRepository.save(session);
                    }
                }
            } catch (Exception e) {
                // Token doğrulama hatası - sessizce devam et, authentication olmadan
                logger.warn("Token doğrulama hatası: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}


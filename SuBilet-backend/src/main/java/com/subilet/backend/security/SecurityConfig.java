package com.subilet.backend.security;

import com.subilet.backend.repository.SessionRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security yapılandırması.
 * Endpoint'lerin hangi rollere açık olduğunu belirler.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final SessionRepository sessionRepository;

    public SecurityConfig(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF devre dışı (REST API için)
            .csrf(csrf -> csrf.disable())
            
            // CORS yapılandırması
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Session yönetimi - Stateless (her request bağımsız)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Token filter'ı ekle
            .addFilterBefore(
                new TokenAuthenticationFilter(sessionRepository),
                UsernamePasswordAuthenticationFilter.class
            )
            
            // Endpoint yetkilendirme kuralları
            .authorizeHttpRequests(auth -> auth
                // ==================== PUBLIC ENDPOINTS ====================
                // Auth işlemleri - herkese açık
                .requestMatchers("/api/auth/**").permitAll()
                
                // Havalimanları ve şehirler - herkese açık (dropdown'lar için)
                .requestMatchers(HttpMethod.GET, "/api/airports").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/airports/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/cities").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/cities/**").permitAll()
                
                // Havayolları listesi - herkese açık
                .requestMatchers(HttpMethod.GET, "/api/airlines").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/airlines/**").permitAll()
                
                // Uçak tipleri - herkese açık
                .requestMatchers(HttpMethod.GET, "/api/aircraft-types").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/aircraft-types/**").permitAll()
                
                // Uçaklar listesi - herkese açık
                .requestMatchers(HttpMethod.GET, "/api/aircrafts").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/aircrafts/**").permitAll()
                
                // Uçuş listesi ve arama - HERKESE AÇIK
                .requestMatchers(HttpMethod.GET, "/api/flights").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/flights/**").permitAll()
                
                // Rezervasyon listesi - HERKESE AÇIK
                .requestMatchers(HttpMethod.GET, "/api/reservations").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reservations/**").permitAll()
                
                // ==================== CUSTOMER + ADMIN ENDPOINTS ====================
                // Rezervasyon işlemleri - giriş yapmış kullanıcılar (POST/PUT/DELETE için)
                .requestMatchers(HttpMethod.POST, "/api/reservations/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/reservations/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/reservations/**").authenticated()
                
                // Ödeme işlemleri - giriş yapmış kullanıcılar
                .requestMatchers("/api/payments/**").authenticated()
                
                // Müşteri bilgileri - giriş yapmış kullanıcılar
                .requestMatchers("/api/customers/**").authenticated()
                
                // ==================== ADMIN ONLY ENDPOINTS ====================
                // Admin paneli - sadece admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Uçuş oluşturma/güncelleme/silme - sadece admin
                .requestMatchers(HttpMethod.POST, "/api/flights").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/flights/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/flights/**").hasRole("ADMIN")
                
                // Havalimanı oluşturma/güncelleme/silme - sadece admin
                .requestMatchers(HttpMethod.POST, "/api/airports").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/airports/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/airports/**").hasRole("ADMIN")
                
                // Havayolu oluşturma/güncelleme/silme - sadece admin
                .requestMatchers(HttpMethod.POST, "/api/airlines").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/airlines/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/airlines/**").hasRole("ADMIN")
                
                // Uçak oluşturma/güncelleme/silme - sadece admin
                .requestMatchers(HttpMethod.POST, "/api/aircrafts").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/aircrafts/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/aircrafts/**").hasRole("ADMIN")
                
                // Diğer tüm istekler - kimlik doğrulama gerekli
                .anyRequest().authenticated()
            )
            
            // Hata durumunda JSON response döndür
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.setStatus(401);
                    response.getWriter().write("{\"success\":false,\"message\":\"Oturum açmanız gerekiyor. Lütfen giriş yapın.\",\"data\":null}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.setStatus(403);
                    response.getWriter().write("{\"success\":false,\"message\":\"Bu işlem için yetkiniz yok.\",\"data\":null}");
                })
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}


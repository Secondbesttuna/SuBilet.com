package com.subilet.backend.security;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Token'dan çıkarılan kullanıcı bilgilerini tutar.
 * Controller'larda @AuthenticationPrincipal ile erişilebilir.
 */
@Data
@AllArgsConstructor
public class TokenUserDetails {
    private Integer userId;
    private String userType; // "CUSTOMER" veya "ADMIN"
    private String token;
}


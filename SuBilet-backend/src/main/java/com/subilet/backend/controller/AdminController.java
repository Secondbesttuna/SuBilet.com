package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.*;
import com.subilet.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin paneli için tüm yönetim endpoint'leri
 * CRUD işlemleri (oluşturma, güncelleme, silme)
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private FlightService flightService;

    @Autowired
    private AirportService airportService;

    @Autowired
    private AirlineService airlineService;

    // ==================== ADMİN GİRİŞ ====================

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

    // ==================== UÇUŞ YÖNETİMİ ====================

    @PostMapping("/flights")
    public ResponseEntity<ApiResponse<Flight>> createFlight(@RequestBody Flight flight) {
        try {
            Flight created = flightService.createFlight(flight);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Uçuş başarıyla oluşturuldu", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Uçuş oluşturulamadı: " + e.getMessage()));
        }
    }

    @PutMapping("/flights/{id}")
    public ResponseEntity<ApiResponse<Flight>> updateFlight(@PathVariable Integer id, @RequestBody Flight flight) {
        try {
            Flight updated = flightService.updateFlight(id, flight);
            return ResponseEntity.ok(ApiResponse.success("Uçuş başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Uçuş bulunamadı veya güncellenemedi"));
        }
    }

    @DeleteMapping("/flights/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFlight(@PathVariable Integer id) {
        try {
            flightService.deleteFlight(id);
            return ResponseEntity.ok(ApiResponse.success("Uçuş başarıyla silindi", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Uçuş bulunamadı veya silinemedi"));
        }
    }

    // ==================== HAVALİMANI YÖNETİMİ ====================

    @PostMapping("/airports")
    public ResponseEntity<ApiResponse<Airport>> createAirport(@RequestBody Airport airport) {
        try {
            Airport created = airportService.createAirport(airport);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Havalimanı başarıyla oluşturuldu", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Havalimanı oluşturulamadı: " + e.getMessage()));
        }
    }

    @PutMapping("/airports/{id}")
    public ResponseEntity<ApiResponse<Airport>> updateAirport(@PathVariable Integer id, @RequestBody Airport airport) {
        try {
            Airport updated = airportService.updateAirport(id, airport);
            return ResponseEntity.ok(ApiResponse.success("Havalimanı başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Havalimanı bulunamadı veya güncellenemedi"));
        }
    }

    @DeleteMapping("/airports/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAirport(@PathVariable Integer id) {
        try {
            airportService.deleteAirport(id);
            return ResponseEntity.ok(ApiResponse.success("Havalimanı başarıyla silindi", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Havalimanı bulunamadı veya silinemedi"));
        }
    }

    // ==================== HAVAYOLU YÖNETİMİ ====================

    @PostMapping("/airlines")
    public ResponseEntity<ApiResponse<Airline>> createAirline(@RequestBody Airline airline) {
        try {
            Airline created = airlineService.createAirline(airline);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Havayolu başarıyla oluşturuldu", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Havayolu oluşturulamadı: " + e.getMessage()));
        }
    }

    @PutMapping("/airlines/{id}")
    public ResponseEntity<ApiResponse<Airline>> updateAirline(@PathVariable Integer id, @RequestBody Airline airline) {
        try {
            Airline updated = airlineService.updateAirline(id, airline);
            return ResponseEntity.ok(ApiResponse.success("Havayolu başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Havayolu bulunamadı veya güncellenemedi"));
        }
    }

    @DeleteMapping("/airlines/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAirline(@PathVariable Integer id) {
        try {
            airlineService.deleteAirline(id);
            return ResponseEntity.ok(ApiResponse.success("Havayolu başarıyla silindi", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Havayolu bulunamadı veya silinemedi"));
        }
    }
}

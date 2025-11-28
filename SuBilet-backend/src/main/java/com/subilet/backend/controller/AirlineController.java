package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Airline;
import com.subilet.backend.service.AirlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airlines")
@CrossOrigin(origins = "http://localhost:3000")
public class AirlineController {

    @Autowired
    private AirlineService airlineService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Airline>>> getAllAirlines() {
        List<Airline> airlines = airlineService.getAllAirlines();
        return ResponseEntity.ok(ApiResponse.success("Havayolları başarıyla getirildi", airlines));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Airline>> getAirlineById(@PathVariable Integer id) {
        return airlineService.getAirlineById(id)
                .map(airline -> ResponseEntity.ok(ApiResponse.success("Havayolu bulundu", airline)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Havayolu bulunamadı")));
    }

    @PostMapping
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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Airline>> updateAirline(@PathVariable Integer id, @RequestBody Airline airline) {
        try {
            Airline updated = airlineService.updateAirline(id, airline);
            return ResponseEntity.ok(ApiResponse.success("Havayolu başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Havayolu bulunamadı veya güncellenemedi"));
        }
    }

    @DeleteMapping("/{id}")
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
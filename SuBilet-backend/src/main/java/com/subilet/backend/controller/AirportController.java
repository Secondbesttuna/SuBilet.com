package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Airport;
import com.subilet.backend.service.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airports")
@CrossOrigin(origins = "http://localhost:3000")
public class AirportController {

    @Autowired
    private AirportService airportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Airport>>> getAllAirports() {
        List<Airport> airports = airportService.getAllAirports();
        return ResponseEntity.ok(ApiResponse.success("Havalimanları başarıyla getirildi", airports));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Airport>> getAirportById(@PathVariable Integer id) {
        return airportService.getAirportById(id)
                .map(airport -> ResponseEntity.ok(ApiResponse.success("Havalimanı bulundu", airport)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Havalimanı bulunamadı")));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<Airport>> getAirportByCode(@PathVariable String code) {
        return airportService.getAirportByCode(code)
                .map(airport -> ResponseEntity.ok(ApiResponse.success("Havalimanı bulundu", airport)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Bu kod ile havalimanı bulunamadı")));
    }

    @PostMapping
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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Airport>> updateAirport(@PathVariable Integer id, @RequestBody Airport airport) {
        try {
            Airport updated = airportService.updateAirport(id, airport);
            return ResponseEntity.ok(ApiResponse.success("Havalimanı başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Havalimanı bulunamadı veya güncellenemedi"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAirport(@PathVariable Integer id) {
        try {
            airportService.deleteAirport(id);
            return ResponseEntity.ok(ApiResponse.success("Havalimanı başarıyla silindi", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Havalimanı bulunamadı veya silinemedi"));
        }
    }
}
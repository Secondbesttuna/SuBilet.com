package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Aircraft;
import com.subilet.backend.service.AircraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aircrafts")
@CrossOrigin(origins = "http://localhost:3000")
public class AircraftController {

    @Autowired
    private AircraftService aircraftService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Aircraft>>> getAllAircrafts() {
        List<Aircraft> aircrafts = aircraftService.getAllAircrafts();
        return ResponseEntity.ok(ApiResponse.success("Uçaklar başarıyla getirildi", aircrafts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Aircraft>> getAircraftById(@PathVariable Integer id) {
        return aircraftService.getAircraftById(id)
                .map(aircraft -> ResponseEntity.ok(ApiResponse.success("Uçak bulundu", aircraft)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Uçak bulunamadı")));
    }

    @GetMapping("/airline/{airlineId}")
    public ResponseEntity<ApiResponse<List<Aircraft>>> getAircraftsByAirlineId(@PathVariable Integer airlineId) {
        List<Aircraft> aircrafts = aircraftService.getAircraftsByAirlineId(airlineId);
        return ResponseEntity.ok(ApiResponse.success("Uçaklar başarıyla getirildi", aircrafts));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Aircraft>> createAircraft(@RequestBody Aircraft aircraft) {
        try {
            Aircraft created = aircraftService.createAircraft(aircraft);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Uçak başarıyla oluşturuldu", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Uçak oluşturulamadı: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Aircraft>> updateAircraft(@PathVariable Integer id, @RequestBody Aircraft aircraft) {
        try {
            Aircraft updated = aircraftService.updateAircraft(id, aircraft);
            return ResponseEntity.ok(ApiResponse.success("Uçak başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Uçak bulunamadı veya güncellenemedi"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAircraft(@PathVariable Integer id) {
        try {
            aircraftService.deleteAircraft(id);
            return ResponseEntity.ok(ApiResponse.success("Uçak başarıyla silindi", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Uçak bulunamadı veya silinemedi"));
        }
    }
}
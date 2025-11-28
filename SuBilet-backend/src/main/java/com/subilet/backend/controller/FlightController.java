package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Flight;
import com.subilet.backend.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:3000")
public class FlightController {

    @Autowired
    private FlightService flightService;

    // Tüm uçuşları getir
    @GetMapping
    public ResponseEntity<ApiResponse<List<Flight>>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        return ResponseEntity.ok(ApiResponse.success("Uçuşlar başarıyla getirildi", flights));
    }

    // ID'ye göre uçuş getir
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Flight>> getFlightById(@PathVariable Integer id) {
        return flightService.getFlightById(id)
                .map(flight -> ResponseEntity.ok(ApiResponse.success("Uçuş bulundu", flight)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Uçuş bulunamadı")));
    }

    // Uçuş arama (origin, destination, date)
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Flight>>> searchFlights(
            @RequestParam Integer originAirportId,
            @RequestParam Integer destinationAirportId,
            @RequestParam String date) {
        try {
            LocalDate flightDate = LocalDate.parse(date);
            List<Flight> flights = flightService.searchFlights(originAirportId, destinationAirportId, flightDate);
            String message = flights.isEmpty() 
                ? "Bu kriterlere uygun uçuş bulunamadı" 
                : flights.size() + " uçuş bulundu";
            return ResponseEntity.ok(ApiResponse.success(message, flights));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Tarih formatı hatalı veya geçersiz parametreler"));
        }
    }

    // Yeni uçuş oluştur
    @PostMapping
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

    // Uçuş güncelle
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Flight>> updateFlight(@PathVariable Integer id, @RequestBody Flight flight) {
        try {
            Flight updated = flightService.updateFlight(id, flight);
            return ResponseEntity.ok(ApiResponse.success("Uçuş başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Uçuş bulunamadı veya güncellenemedi"));
        }
    }

    // Uçuş sil
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFlight(@PathVariable Integer id) {
        try {
            flightService.deleteFlight(id);
            return ResponseEntity.ok(ApiResponse.success("Uçuş başarıyla silindi", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Uçuş bulunamadı veya silinemedi"));
        }
    }
}
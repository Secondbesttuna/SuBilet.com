package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Reservation;
import com.subilet.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Reservation>>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Reservation>> getReservationById(@PathVariable Integer id) {
        return reservationService.getReservationById(id)
                .map(res -> ResponseEntity.ok(ApiResponse.success("Rezervasyon bulundu", res)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Rezervasyon bulunamadı")));
    }

    @GetMapping("/pnr/{pnr}")
    public ResponseEntity<ApiResponse<Reservation>> getReservationByPNR(@PathVariable String pnr) {
        return reservationService.getReservationByPNR(pnr)
                .map(res -> ResponseEntity.ok(ApiResponse.success("Rezervasyon bulundu", res)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Bu PNR ile rezervasyon bulunamadı")));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Reservation>>> getReservationsByCustomerId(@PathVariable Integer customerId) {
        List<Reservation> reservations = reservationService.getReservationsByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.success("Rezervasyonlar başarıyla getirildi", reservations));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Reservation>> createReservation(@RequestBody Reservation reservation) {
        try {
            Reservation created = reservationService.createReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Rezervasyon başarıyla oluşturuldu. PNR: " + created.getPnr(), created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Rezervasyon oluşturulamadı: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Reservation>> updateReservation(@PathVariable Integer id, @RequestBody Reservation reservation) {
        try {
            Reservation updated = reservationService.updateReservation(id, reservation);
            return ResponseEntity.ok(ApiResponse.success("Rezervasyon başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Rezervasyon bulunamadı veya güncellenemedi"));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelReservation(@PathVariable Integer id) {
        try {
            reservationService.cancelReservation(id);
            return ResponseEntity.ok(ApiResponse.success("Rezervasyon başarıyla iptal edildi", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Rezervasyon bulunamadı veya iptal edilemedi"));
        }
    }
}
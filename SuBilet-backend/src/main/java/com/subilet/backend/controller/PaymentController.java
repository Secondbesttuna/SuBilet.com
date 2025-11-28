package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Payment;
import com.subilet.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.success("Ödemeler başarıyla getirildi", payments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentById(@PathVariable Integer id) {
        return paymentService.getPaymentById(id)
                .map(payment -> ResponseEntity.ok(ApiResponse.success("Ödeme bulundu", payment)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Ödeme bulunamadı")));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentByReservationId(@PathVariable Integer reservationId) {
        return paymentService.getPaymentByReservationId(reservationId)
                .map(payment -> ResponseEntity.ok(ApiResponse.success("Ödeme bulundu", payment)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Bu rezervasyon için ödeme bulunamadı")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Payment>> createPayment(@RequestBody Payment payment) {
        try {
            Payment created = paymentService.createPayment(payment);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Ödeme başarıyla kaydedildi", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Ödeme oluşturulamadı: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Payment>> updatePaymentStatus(@PathVariable Integer id, @RequestParam String status) {
        try {
            Payment updated = paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Ödeme durumu başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Ödeme bulunamadı veya güncellenemedi"));
        }
    }
}
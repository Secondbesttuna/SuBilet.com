package com.subilet.backend.service;

import com.subilet.backend.entity.Payment;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Integer id) {
        return paymentRepository.findById(id);
    }

    public Payment createPayment(Payment payment) {
        payment.setPaymentTime(LocalDateTime.now());
        payment.setPaymentStatus("COMPLETED");
        return paymentRepository.save(payment);
    }

    public Payment updatePaymentStatus(Integer id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ödeme bulunamadı: " + id));
        payment.setPaymentStatus(status);
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentByReservationId(Integer reservationId) {
        return paymentRepository.findAll().stream()
                .filter(p -> p.getReservation().getReservationId().equals(reservationId))
                .findFirst();
    }
}


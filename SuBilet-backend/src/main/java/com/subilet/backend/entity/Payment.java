package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    // Bir ödeme sadece bir rezervasyona aittir (OneToOne)
    @OneToOne
    @JoinColumn(name = "reservation_id", unique = true, nullable = false)
    private Reservation reservation;

    @Column(name = "method")
    private String method; // Credit Card, Cash

    @Column(name = "currency")
    private String currency;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "payment_status")
    private String paymentStatus;
}
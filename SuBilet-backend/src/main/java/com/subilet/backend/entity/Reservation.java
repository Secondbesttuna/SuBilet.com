package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reservation", indexes = {
    @Index(name = "idx_reservation_user_id", columnList = "user_id"),
})
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Integer reservationId;

    @Column(name = "pnr", unique = true, nullable = false)
    private String pnr;

    // Rezervasyonu kim yaptı?
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Customer customer;

    // Hangi uçuşa yaptı?
    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "seat_number")
    private String seatNumber;

    @Column(name = "reservation_date")
    private LocalDateTime reservationDate;

    @Column(name = "status")
    private String status; // CONFIRMED, CANCELLED vb.
}
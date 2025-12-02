package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "flight", indexes = {
    @Index(name = "idx_flight_kalkis_tarihi", columnList = "kalkis_tarihi"),
    })
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Integer flightId;

    // Hangi Havayolu?
    @ManyToOne
    @JoinColumn(name = "airline_id", nullable = false)
    private Airline airline;

    // Hangi Uçak?
    @ManyToOne
    @JoinColumn(name = "aircraft_id")
    private Aircraft aircraft;

    // Nereden Kalkıyor?
    @ManyToOne
    @JoinColumn(name = "origin_airport_id", nullable = false)
    private Airport originAirport;

    // Nereye İniyor?
    @ManyToOne
    @JoinColumn(name = "destination_airport_id", nullable = false)
    private Airport destinationAirport;

    @Column(name = "kalkis_tarihi", nullable = false)
    private LocalDateTime kalkisTarihi;

    @Column(name = "inis_tarihi", nullable = false)
    private LocalDateTime inisTarihi;

    @Column(name = "base_price")
    private BigDecimal basePrice; // Para birimleri için BigDecimal kullanılır
}
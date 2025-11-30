package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "flight")
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
    
    // Aktarmalı uçuş mu?
    @Column(name = "has_layover")
    private Boolean hasLayover = false;
    
    // Aktarma havalimanı (varsa)
    @ManyToOne
    @JoinColumn(name = "layover_airport_id")
    private Airport layoverAirport;
    
    // Aktarma süresi (dakika cinsinden)
    @Column(name = "layover_duration_minutes")
    private Integer layoverDurationMinutes;
}
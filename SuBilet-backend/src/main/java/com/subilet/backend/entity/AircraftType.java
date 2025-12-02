package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Uçak Türü - Tüm havayolları tarafından kullanılabilecek uçak modelleri
 * Örn: Boeing 737-800, Airbus A320neo, vb.
 */
@Data
@Entity
@Table(name = "aircraft_type")
public class AircraftType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aircraft_type_id")
    private Integer aircraftTypeId;

    @Column(name = "model", nullable = false, unique = true)
    private String model; // Örn: "Boeing 737-800"

    @Column(name = "manufacturer", nullable = false)
    private String manufacturer; // Örn: "Boeing", "Airbus"

    @Column(name = "capacity")
    private Integer capacity; // Yolcu kapasitesi

    @Column(name = "range_km")
    private Integer rangeKm; // Menzil (km)

    @Column(name = "cruise_speed_kmh")
    private Integer cruiseSpeedKmh; // Seyir hızı (km/sa)
}


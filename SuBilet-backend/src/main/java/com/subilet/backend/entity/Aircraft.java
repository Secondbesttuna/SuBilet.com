package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "aircraft")
public class Aircraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aircraft_id")
    private Integer aircraftId;

    @ManyToOne
    @JoinColumn(name = "airline_id", nullable = false)
    private Airline airline;

    @ManyToOne
    @JoinColumn(name = "aircraft_type_id")
    private AircraftType aircraftType;

    @Column(name = "model")
    private String model;

    @Column(name = "tail_number", unique = true)
    private String tailNumber;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "uretici")
    private String uretici;
}
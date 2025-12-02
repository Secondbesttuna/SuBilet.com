package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "airport")
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airport_id")
    private Integer airportId;

    @Column(name = "code", nullable = false, unique = true, length = 10)
    private String code; // Örn: IST, ESB

    @Column(name = "name", nullable = false)
    private String name;

    // City ile ManyToOne ilişki
    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
}
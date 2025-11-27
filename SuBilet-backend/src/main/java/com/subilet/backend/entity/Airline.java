package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "airline")
public class Airline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airline_id")
    private Integer airlineId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "ulke")
    private String ulke;

    @Column(name = "ucus_sayisi")
    private Integer ucusSayisi;

    @Column(name = "ucak_sayisi")
    private Integer ucakSayisi;

    @Column(name = "iata_code", unique = true)
    private String iataCode;

    @Column(name = "icao_code", unique = true)
    private String icaoCode;
}
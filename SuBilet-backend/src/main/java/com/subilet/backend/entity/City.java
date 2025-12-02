package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "city")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private Integer cityId;

    @Column(name = "city", nullable = false, unique = true)
    private String city;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "time_zone", nullable = false)
    private String timeZone;
}


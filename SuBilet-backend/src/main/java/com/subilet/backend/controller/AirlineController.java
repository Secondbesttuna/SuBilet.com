package com.subilet.backend.controller;

import com.subilet.backend.entity.Airline;
import com.subilet.backend.repository.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Bu sınıfın bir API olduğunu belirtir
@RequestMapping("/api/airlines") // Bu adrese gelen istekleri karşılar (http://localhost:8080/api/airlines)
@CrossOrigin(origins = "http://localhost:3000") // React (3000 portu) buraya erişebilsin diye izin veriyoruz
public class AirlineController {

    @Autowired
    private AirlineRepository airlineRepository;

    // TÜM HAVAYOLLARINI GETİR
    @GetMapping
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }

    // YENİ HAVAYOLU EKLE
    @PostMapping
    public Airline createAirline(@RequestBody Airline airline) {
        return airlineRepository.save(airline);
    }
}
package com.subilet.backend.service;

import com.subilet.backend.entity.Airline;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AirlineService {

    @Autowired
    private AirlineRepository airlineRepository;

    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }

    public Optional<Airline> getAirlineById(Integer id) {
        return airlineRepository.findById(id);
    }

    public Airline createAirline(Airline airline) {
        return airlineRepository.save(airline);
    }

    public Airline updateAirline(Integer id, Airline airlineDetails) {
        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Havayolu bulunamadı: " + id));

        airline.setName(airlineDetails.getName());
        airline.setUlke(airlineDetails.getUlke());
        airline.setYillikUcusSayisi(airlineDetails.getYillikUcusSayisi());
        airline.setUcakSayisi(airlineDetails.getUcakSayisi());
        airline.setIataCode(airlineDetails.getIataCode());
        airline.setIcaoCode(airlineDetails.getIcaoCode());

        return airlineRepository.save(airline);
    }

    public void deleteAirline(Integer id) {
        airlineRepository.deleteById(id);
    }
}


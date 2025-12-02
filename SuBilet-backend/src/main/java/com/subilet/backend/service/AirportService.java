package com.subilet.backend.service;

import com.subilet.backend.entity.Airport;
import com.subilet.backend.entity.City;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.AirportRepository;
import com.subilet.backend.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AirportService {

    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private CityRepository cityRepository;

    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    public Optional<Airport> getAirportById(Integer id) {
        return airportRepository.findById(id);
    }

    public Optional<Airport> getAirportByCode(String code) {
        return airportRepository.findAll().stream()
                .filter(a -> a.getCode().equalsIgnoreCase(code))
                .findFirst();
    }

    public Airport createAirport(Airport airport) {
        // City ilişkisini veritabanından yükle
        if (airport.getCity() != null && airport.getCity().getCityId() != null) {
            City city = cityRepository.findById(airport.getCity().getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Şehir bulunamadı"));
            airport.setCity(city);
        }
        return airportRepository.save(airport);
    }

    public Airport updateAirport(Integer id, Airport airportDetails) {
        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Havalimanı bulunamadı: " + id));

        airport.setCode(airportDetails.getCode());
        airport.setName(airportDetails.getName());
        
        // City ilişkisini veritabanından yükle
        if (airportDetails.getCity() != null && airportDetails.getCity().getCityId() != null) {
            City city = cityRepository.findById(airportDetails.getCity().getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Şehir bulunamadı"));
            airport.setCity(city);
        }

        return airportRepository.save(airport);
    }

    public void deleteAirport(Integer id) {
        airportRepository.deleteById(id);
    }
}


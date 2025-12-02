package com.subilet.backend.service;

import com.subilet.backend.entity.Aircraft;
import com.subilet.backend.entity.AircraftType;
import com.subilet.backend.entity.Airline;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.AircraftRepository;
import com.subilet.backend.repository.AircraftTypeRepository;
import com.subilet.backend.repository.AirlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AircraftService {

    @Autowired
    private AircraftRepository aircraftRepository;

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AircraftTypeRepository aircraftTypeRepository;

    public List<Aircraft> getAllAircrafts() {
        return aircraftRepository.findAllWithDetails();
    }

    public Optional<Aircraft> getAircraftById(Integer id) {
        return aircraftRepository.findById(id);
    }

    public List<Aircraft> getAircraftsByAirlineId(Integer airlineId) {
        return aircraftRepository.findByAirlineId(airlineId);
    }

    public Aircraft createAircraft(Aircraft aircraft) {
        return aircraftRepository.save(aircraft);
    }

    public Aircraft createAircraftWithRelations(Aircraft aircraft) {
        Airline airline = null;
        
        // Airline ilişkisini yükle
        if (aircraft.getAirline() != null && aircraft.getAirline().getAirlineId() != null) {
            airline = airlineRepository.findById(aircraft.getAirline().getAirlineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Havayolu bulunamadı"));
            aircraft.setAirline(airline);
        }

        // AircraftType ilişkisini yükle
        if (aircraft.getAircraftType() != null && aircraft.getAircraftType().getAircraftTypeId() != null) {
            AircraftType type = aircraftTypeRepository.findById(aircraft.getAircraftType().getAircraftTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Uçak türü bulunamadı"));
            aircraft.setAircraftType(type);
            // Model ve kapasite bilgilerini uçak türünden al
            if (aircraft.getModel() == null || aircraft.getModel().isEmpty()) {
                aircraft.setModel(type.getModel());
            }
            if (aircraft.getCapacity() == null) {
                aircraft.setCapacity(type.getCapacity());
            }
            if (aircraft.getUretici() == null || aircraft.getUretici().isEmpty()) {
                aircraft.setUretici(type.getManufacturer());
            }
        }

        Aircraft saved = aircraftRepository.save(aircraft);
        
        // Havayolunun uçak sayısını güncelle
        if (airline != null) {
            updateAirlineAircraftCount(airline.getAirlineId());
        }
        
        return saved;
    }

    public void deleteAircraft(Integer id) {
        Aircraft aircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uçak bulunamadı"));
        Integer airlineId = aircraft.getAirline() != null ? aircraft.getAirline().getAirlineId() : null;
        
        aircraftRepository.deleteById(id);
        
        // Havayolunun uçak sayısını güncelle
        if (airlineId != null) {
            updateAirlineAircraftCount(airlineId);
        }
    }

    // Havayolunun uçak sayısını gerçek uçak sayısına göre güncelle
    private void updateAirlineAircraftCount(Integer airlineId) {
        Airline airline = airlineRepository.findById(airlineId)
                .orElseThrow(() -> new ResourceNotFoundException("Havayolu bulunamadı"));
        
        int actualCount = aircraftRepository.findByAirlineId(airlineId).size();
        
        airline.setUcakSayisi(actualCount);
        airlineRepository.save(airline);
    }
}


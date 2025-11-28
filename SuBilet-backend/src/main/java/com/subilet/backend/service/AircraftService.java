package com.subilet.backend.service;

import com.subilet.backend.entity.Aircraft;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.AircraftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AircraftService {

    @Autowired
    private AircraftRepository aircraftRepository;

    public List<Aircraft> getAllAircrafts() {
        return aircraftRepository.findAll();
    }

    public Optional<Aircraft> getAircraftById(Integer id) {
        return aircraftRepository.findById(id);
    }

    public Aircraft createAircraft(Aircraft aircraft) {
        return aircraftRepository.save(aircraft);
    }

    public Aircraft updateAircraft(Integer id, Aircraft aircraftDetails) {
        Aircraft aircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uçak bulunamadı: " + id));

        aircraft.setAirline(aircraftDetails.getAirline());
        aircraft.setModel(aircraftDetails.getModel());
        aircraft.setTailNumber(aircraftDetails.getTailNumber());
        aircraft.setCapacity(aircraftDetails.getCapacity());
        aircraft.setUretici(aircraftDetails.getUretici());

        return aircraftRepository.save(aircraft);
    }

    public void deleteAircraft(Integer id) {
        aircraftRepository.deleteById(id);
    }

    public List<Aircraft> getAircraftsByAirlineId(Integer airlineId) {
        return aircraftRepository.findAll().stream()
                .filter(a -> a.getAirline().getAirlineId().equals(airlineId))
                .toList();
    }
}


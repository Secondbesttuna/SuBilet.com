package com.subilet.backend.service;

import com.subilet.backend.entity.AircraftType;
import com.subilet.backend.repository.AircraftTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AircraftTypeService {

    @Autowired
    private AircraftTypeRepository aircraftTypeRepository;

    public List<AircraftType> getAllAircraftTypes() {
        return aircraftTypeRepository.findAll();
    }

    public Optional<AircraftType> getAircraftTypeById(Integer id) {
        return aircraftTypeRepository.findById(id);
    }

    public Optional<AircraftType> getAircraftTypeByModel(String model) {
        return aircraftTypeRepository.findByModel(model);
    }

    public AircraftType createAircraftType(AircraftType aircraftType) {
        return aircraftTypeRepository.save(aircraftType);
    }
}


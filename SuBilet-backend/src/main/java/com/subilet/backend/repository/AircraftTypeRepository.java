package com.subilet.backend.repository;

import com.subilet.backend.entity.AircraftType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AircraftTypeRepository extends JpaRepository<AircraftType, Integer> {
    Optional<AircraftType> findByModel(String model);
}


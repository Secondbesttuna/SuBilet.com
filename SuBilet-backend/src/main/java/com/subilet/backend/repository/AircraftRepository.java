package com.subilet.backend.repository;

import com.subilet.backend.entity.Aircraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AircraftRepository extends JpaRepository<Aircraft, Integer> {
    
    // Tüm uçakları airline ve aircraftType bilgileriyle birlikte getir
    @Query("SELECT a FROM Aircraft a LEFT JOIN FETCH a.airline LEFT JOIN FETCH a.aircraftType")
    List<Aircraft> findAllWithDetails();
    
    // Belirli bir havayoluna ait uçakları getir
    @Query("SELECT a FROM Aircraft a LEFT JOIN FETCH a.airline LEFT JOIN FETCH a.aircraftType WHERE a.airline.airlineId = :airlineId")
    List<Aircraft> findByAirlineId(Integer airlineId);
}


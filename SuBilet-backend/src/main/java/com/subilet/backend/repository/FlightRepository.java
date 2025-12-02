package com.subilet.backend.repository;

import com.subilet.backend.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Integer> {
    
    // Tüm ilişkileri birlikte getir - kalkış tarihine göre sıralı
    @Query("SELECT f FROM Flight f JOIN FETCH f.airline JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport ORDER BY f.kalkisTarihi ASC")
    List<Flight> findAllWithDetails();
    
    // ID'ye göre tüm ilişkileri birlikte getir
    @Query("SELECT f FROM Flight f JOIN FETCH f.airline JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport WHERE f.flightId = :id")
    Optional<Flight> findByIdWithDetails(Integer id);
    
    // Kalkış tarihine göre sıralı tüm uçuşlar
    List<Flight> findAllByOrderByKalkisTarihiAsc();
    
    // Kalkış tarihine göre azalan sıralı tüm uçuşlar
    List<Flight> findAllByOrderByKalkisTarihiDesc();
}

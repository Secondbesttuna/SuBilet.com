package com.subilet.backend.repository;

import com.subilet.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    
    Optional<Reservation> findByPnr(String pnr);
    
    // Customer ve Flight ilişkilerini birlikte getir
    @Query("SELECT r FROM Reservation r JOIN FETCH r.customer JOIN FETCH r.flight f JOIN FETCH f.airline JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport")
    List<Reservation> findAllWithDetails();
    
    // ID'ye göre customer ve flight ile birlikte getir
    @Query("SELECT r FROM Reservation r JOIN FETCH r.customer JOIN FETCH r.flight f JOIN FETCH f.airline JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport WHERE r.reservationId = :id")
    Optional<Reservation> findByIdWithDetails(Integer id);
    
    // PNR'ye göre customer ve flight ile birlikte getir
    @Query("SELECT r FROM Reservation r JOIN FETCH r.customer JOIN FETCH r.flight f JOIN FETCH f.airline JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport WHERE r.pnr = :pnr")
    Optional<Reservation> findByPnrWithDetails(String pnr);
    
    // Customer ID'ye göre customer ve flight ile birlikte getir
    @Query("SELECT r FROM Reservation r JOIN FETCH r.customer JOIN FETCH r.flight f JOIN FETCH f.airline JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport WHERE r.customer.userId = :customerId")
    List<Reservation> findByCustomerIdWithDetails(Integer customerId);
}
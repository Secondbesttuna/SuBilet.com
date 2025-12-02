package com.subilet.backend.repository;

import com.subilet.backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    
    // Belirli bir uçuş ve koltuk numarası için aktif rezervasyon var mı kontrol et
    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.flight.flightId = :flightId AND r.seatNumber = :seatNumber AND r.status != 'CANCELLED'")
    boolean existsByFlightIdAndSeatNumber(@Param("flightId") Integer flightId, @Param("seatNumber") String seatNumber);
    
    // Belirli bir uçuş için dolu koltukları getir
    @Query("SELECT r.seatNumber FROM Reservation r WHERE r.flight.flightId = :flightId AND r.status != 'CANCELLED'")
    List<String> findOccupiedSeatsByFlightId(@Param("flightId") Integer flightId);
    
    // Belirli bir uçuş için aktif rezervasyon sayısını getir
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.flight.flightId = :flightId AND r.status != 'CANCELLED'")
    int countActiveReservationsByFlightId(@Param("flightId") Integer flightId);
}
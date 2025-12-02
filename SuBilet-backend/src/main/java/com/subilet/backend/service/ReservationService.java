package com.subilet.backend.service;

import com.subilet.backend.entity.Customer;
import com.subilet.backend.entity.Flight;
import com.subilet.backend.entity.Reservation;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.CustomerRepository;
import com.subilet.backend.repository.FlightRepository;
import com.subilet.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private FlightRepository flightRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAllWithDetails();
    }

    public Optional<Reservation> getReservationById(Integer id) {
        return reservationRepository.findByIdWithDetails(id);
    }

    public Reservation createReservation(Reservation reservation) {
        // Customer'ı veritabanından yükle
        if (reservation.getCustomer() != null && reservation.getCustomer().getUserId() != null) {
            Integer customerId = reservation.getCustomer().getUserId();
            Customer customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Müşteri bulunamadı: " + customerId));
            reservation.setCustomer(customer);
        }

        // Flight'ı veritabanından yükle
        Integer flightIdForSeatCheck = null;
        if (reservation.getFlight() != null && reservation.getFlight().getFlightId() != null) {
            final Integer flightId = reservation.getFlight().getFlightId();
            flightIdForSeatCheck = flightId;
            Flight flight = flightRepository.findById(flightId)
                    .orElseThrow(() -> new ResourceNotFoundException("Uçuş bulunamadı: " + flightId));
            reservation.setFlight(flight);
        }

        // Aynı uçuş ve koltuk için zaten rezervasyon var mı kontrol et
        if (flightIdForSeatCheck != null && reservation.getSeatNumber() != null && !reservation.getSeatNumber().isEmpty()) {
            boolean seatOccupied = reservationRepository.existsByFlightIdAndSeatNumber(flightIdForSeatCheck, reservation.getSeatNumber());
            if (seatOccupied) {
                throw new IllegalStateException("Bu koltuk zaten rezerve edilmiş: " + reservation.getSeatNumber());
            }
        }

        // PNR otomatik oluştur
        reservation.setPnr(generatePNR());
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus("CONFIRMED");
        Reservation saved = reservationRepository.save(reservation);
        // İlişkileri yükle
        return reservationRepository.findByIdWithDetails(saved.getReservationId())
                .orElse(saved);
    }
    
    // Belirli bir uçuş için dolu koltukları getir
    public List<String> getOccupiedSeats(Integer flightId) {
        return reservationRepository.findOccupiedSeatsByFlightId(flightId);
    }
    
    // Belirli bir uçuş için aktif rezervasyon sayısını getir
    public int getActiveReservationCount(Integer flightId) {
        return reservationRepository.countActiveReservationsByFlightId(flightId);
    }

    public Reservation updateReservation(Integer id, Reservation reservationDetails) {
        Reservation reservation = reservationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rezervasyon bulunamadı: " + id));

        reservation.setSeatNumber(reservationDetails.getSeatNumber());
        reservation.setStatus(reservationDetails.getStatus());

        return reservationRepository.save(reservation);
    }

    public void cancelReservation(Integer id) {
        Reservation reservation = reservationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rezervasyon bulunamadı: " + id));
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsByCustomerId(Integer customerId) {
        return reservationRepository.findByCustomerIdWithDetails(customerId);
    }

    public Optional<Reservation> getReservationByPNR(String pnr) {
        return reservationRepository.findByPnrWithDetails(pnr);
    }

    // PNR oluşturma helper metodu
    private String generatePNR() {
        return "PNR" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}


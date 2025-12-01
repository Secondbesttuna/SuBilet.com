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
            Customer customer = customerRepository.findById(reservation.getCustomer().getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Müşteri bulunamadı: " + reservation.getCustomer().getUserId()));
            reservation.setCustomer(customer);
        }

        // Flight'ı veritabanından yükle
        if (reservation.getFlight() != null && reservation.getFlight().getFlightId() != null) {
            Flight flight = flightRepository.findById(reservation.getFlight().getFlightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Uçuş bulunamadı: " + reservation.getFlight().getFlightId()));
            reservation.setFlight(flight);
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


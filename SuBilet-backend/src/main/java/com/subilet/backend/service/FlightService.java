package com.subilet.backend.service;

import com.subilet.backend.entity.Flight;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    // Tüm uçuşları getir
    public List<Flight> getAllFlights() {
        return flightRepository.findAllWithDetails();
    }

    // ID'ye göre uçuş getir
    public Optional<Flight> getFlightById(Integer id) {
        return flightRepository.findByIdWithDetails(id);
    }

    // Yeni uçuş oluştur
    public Flight createFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    // Uçuş güncelle
    public Flight updateFlight(Integer id, Flight flightDetails) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uçuş bulunamadı: " + id));

        flight.setAirline(flightDetails.getAirline());
        flight.setAircraft(flightDetails.getAircraft());
        flight.setOriginAirport(flightDetails.getOriginAirport());
        flight.setDestinationAirport(flightDetails.getDestinationAirport());
        flight.setKalkisTarihi(flightDetails.getKalkisTarihi());
        flight.setInisTarihi(flightDetails.getInisTarihi());
        flight.setBasePrice(flightDetails.getBasePrice());

        return flightRepository.save(flight);
    }

    // Uçuş sil
    public void deleteFlight(Integer id) {
        flightRepository.deleteById(id);
    }

    // Kalkış ve varış havalimanına göre uçuş ara
    public List<Flight> searchFlights(Integer originAirportId, Integer destinationAirportId, LocalDate date) {
        // Tüm uçuşları ilişkileriyle birlikte getir ve filtrele
        return flightRepository.findAllWithDetails().stream()
                .filter(f -> f.getOriginAirport().getAirportId().equals(originAirportId) &&
                        f.getDestinationAirport().getAirportId().equals(destinationAirportId) &&
                        f.getKalkisTarihi().toLocalDate().equals(date))
                .toList();
    }
}


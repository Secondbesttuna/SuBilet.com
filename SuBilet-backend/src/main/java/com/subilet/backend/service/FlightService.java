package com.subilet.backend.service;

import com.subilet.backend.entity.Aircraft;
import com.subilet.backend.entity.Airline;
import com.subilet.backend.entity.Airport;
import com.subilet.backend.entity.Flight;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.AircraftRepository;
import com.subilet.backend.repository.AirlineRepository;
import com.subilet.backend.repository.AirportRepository;
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

    @Autowired
    private AirlineRepository airlineRepository;

    @Autowired
    private AircraftRepository aircraftRepository;

    @Autowired
    private AirportRepository airportRepository;

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
        // İlişkileri veritabanından yükle
        if (flight.getAirline() != null && flight.getAirline().getAirlineId() != null) {
            Airline airline = airlineRepository.findById(flight.getAirline().getAirlineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Havayolu bulunamadı"));
            flight.setAirline(airline);
        }

        if (flight.getAircraft() != null && flight.getAircraft().getAircraftId() != null) {
            Aircraft aircraft = aircraftRepository.findById(flight.getAircraft().getAircraftId())
                    .orElseThrow(() -> new ResourceNotFoundException("Uçak bulunamadı"));
            flight.setAircraft(aircraft);
        }

        if (flight.getOriginAirport() != null && flight.getOriginAirport().getAirportId() != null) {
            Airport origin = airportRepository.findById(flight.getOriginAirport().getAirportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kalkış havalimanı bulunamadı"));
            flight.setOriginAirport(origin);
        }

        if (flight.getDestinationAirport() != null && flight.getDestinationAirport().getAirportId() != null) {
            Airport destination = airportRepository.findById(flight.getDestinationAirport().getAirportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Varış havalimanı bulunamadı"));
            flight.setDestinationAirport(destination);
        }

        return flightRepository.save(flight);
    }

    // Uçuş güncelle
    public Flight updateFlight(Integer id, Flight flightDetails) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Uçuş bulunamadı: " + id));

        // İlişkileri veritabanından yükle
        if (flightDetails.getAirline() != null && flightDetails.getAirline().getAirlineId() != null) {
            Airline airline = airlineRepository.findById(flightDetails.getAirline().getAirlineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Havayolu bulunamadı"));
            flight.setAirline(airline);
        }

        if (flightDetails.getAircraft() != null && flightDetails.getAircraft().getAircraftId() != null) {
            Aircraft aircraft = aircraftRepository.findById(flightDetails.getAircraft().getAircraftId())
                    .orElseThrow(() -> new ResourceNotFoundException("Uçak bulunamadı"));
            flight.setAircraft(aircraft);
        }

        if (flightDetails.getOriginAirport() != null && flightDetails.getOriginAirport().getAirportId() != null) {
            Airport origin = airportRepository.findById(flightDetails.getOriginAirport().getAirportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Kalkış havalimanı bulunamadı"));
            flight.setOriginAirport(origin);
        }

        if (flightDetails.getDestinationAirport() != null && flightDetails.getDestinationAirport().getAirportId() != null) {
            Airport destination = airportRepository.findById(flightDetails.getDestinationAirport().getAirportId())
                    .orElseThrow(() -> new ResourceNotFoundException("Varış havalimanı bulunamadı"));
            flight.setDestinationAirport(destination);
        }

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


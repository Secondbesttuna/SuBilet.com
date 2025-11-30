package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.*;
import com.subilet.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Kullanıcı tarafından erişilebilen tüm public endpoint'ler
 * Uçuş arama, rezervasyon yapma, ödeme işlemleri vb.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class PublicController {

    @Autowired
    private FlightService flightService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private AirportService airportService;

    @Autowired
    private AirlineService airlineService;

    // ==================== UÇUŞLAR ====================

    @GetMapping("/flights")
    public ResponseEntity<ApiResponse<List<Flight>>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        return ResponseEntity.ok(ApiResponse.success("Uçuşlar başarıyla getirildi", flights));
    }

    @GetMapping("/flights/{id}")
    public ResponseEntity<ApiResponse<Flight>> getFlightById(@PathVariable Integer id) {
        return flightService.getFlightById(id)
                .map(flight -> ResponseEntity.ok(ApiResponse.success("Uçuş bulundu", flight)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Uçuş bulunamadı")));
    }

    @GetMapping("/flights/search")
    public ResponseEntity<ApiResponse<List<Flight>>> searchFlights(
            @RequestParam Integer originAirportId,
            @RequestParam Integer destinationAirportId,
            @RequestParam String date) {
        try {
            LocalDate flightDate = LocalDate.parse(date);
            List<Flight> flights = flightService.searchFlights(originAirportId, destinationAirportId, flightDate);
            String message = flights.isEmpty() 
                ? "Bu kriterlere uygun uçuş bulunamadı" 
                : flights.size() + " uçuş bulundu";
            return ResponseEntity.ok(ApiResponse.success(message, flights));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Tarih formatı hatalı veya geçersiz parametreler"));
        }
    }

    // ==================== REZERVASYONLAR ====================

    @GetMapping("/reservations")
    public ResponseEntity<ApiResponse<List<Reservation>>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    @GetMapping("/reservations/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<Reservation>>> getReservationsByCustomerId(@PathVariable Integer customerId) {
        List<Reservation> reservations = reservationService.getReservationsByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.success("Rezervasyonlar başarıyla getirildi", reservations));
    }

    @PostMapping("/reservations")
    public ResponseEntity<ApiResponse<Reservation>> createReservation(@RequestBody Reservation reservation) {
        try {
            Reservation created = reservationService.createReservation(reservation);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Rezervasyon başarıyla oluşturuldu. PNR: " + created.getPnr(), created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Rezervasyon oluşturulamadı: " + e.getMessage()));
        }
    }

    @PutMapping("/reservations/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelReservation(@PathVariable Integer id) {
        try {
            reservationService.cancelReservation(id);
            return ResponseEntity.ok(ApiResponse.success("Rezervasyon başarıyla iptal edildi", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Rezervasyon bulunamadı veya iptal edilemedi"));
        }
    }

    // ==================== MÜŞTERİLER ====================

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @GetMapping("/customers/tc/{tcNo}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerByTcNo(@PathVariable String tcNo) {
        return customerService.findByTcNo(tcNo)
                .map(customer -> ResponseEntity.ok(ApiResponse.success("Müşteri bulundu", customer)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Bu TC Kimlik No ile müşteri bulunamadı")));
    }

    @PostMapping("/customers")
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@RequestBody Customer customer) {
        try {
            Customer created = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Müşteri başarıyla kaydedildi", created));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/customers/login")
    public ResponseEntity<ApiResponse<Customer>> customerLogin(@RequestBody Customer loginRequest) {
        return customerService.findByTcNo(loginRequest.getTcNo())
                .map(customer -> ResponseEntity.ok(ApiResponse.success("Giriş başarılı. Hoş geldiniz, " + customer.getIsimSoyad(), customer)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("TC Kimlik No bulunamadı. Lütfen rezervasyon yaparken kullandığınız TC No'yu giriniz")));
    }

    // ==================== ÖDEMELER ====================

    @PostMapping("/payments")
    public ResponseEntity<ApiResponse<Payment>> createPayment(@RequestBody Payment payment) {
        try {
            Payment created = paymentService.createPayment(payment);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Ödeme başarıyla kaydedildi", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Ödeme oluşturulamadı: " + e.getMessage()));
        }
    }

    // ==================== HAVALİMANLARI ====================

    @GetMapping("/airports")
    public ResponseEntity<ApiResponse<List<Airport>>> getAllAirports() {
        List<Airport> airports = airportService.getAllAirports();
        return ResponseEntity.ok(ApiResponse.success("Havalimanları başarıyla getirildi", airports));
    }

    // ==================== HAVAYOLLARI ====================

    @GetMapping("/airlines")
    public ResponseEntity<ApiResponse<List<Airline>>> getAllAirlines() {
        List<Airline> airlines = airlineService.getAllAirlines();
        return ResponseEntity.ok(ApiResponse.success("Havayolları başarıyla getirildi", airlines));
    }
}


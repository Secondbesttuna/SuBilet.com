package com.subilet.backend.config;

import com.subilet.backend.entity.*;
import com.subilet.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            AdminRepository adminRepository,
            AirportRepository airportRepository,
            AirlineRepository airlineRepository,
            AircraftRepository aircraftRepository,
            CustomerRepository customerRepository,
            FlightRepository flightRepository,
            ReservationRepository reservationRepository,
            PaymentRepository paymentRepository) {

        return args -> {
            // create-drop ile tablolar her backend restart'ında otomatik silinir
            // Bu yüzden her seferinde temiz başlangıç yapılır
            System.out.println("🚀 ŞUBİLET - Başlangıç Verileri Yükleniyor...");
            System.out.println("🧹 Temiz başlangıç - Her restart'ta DataInitializer'dan veriler yükleniyor...");

            // ========================================
            // ADMIN KULLANICILARI
            // ========================================
            Admin admin1 = new Admin();
            admin1.setUsername("admin");
            admin1.setPassword("admin123");
            admin1.setFullName("Sistem Yöneticisi");
            adminRepository.save(admin1);

            Admin admin2 = new Admin();
            admin2.setUsername("cansu");
            admin2.setPassword("123456");
            admin2.setFullName("Saadet Cansu Baktıroğlu");
            adminRepository.save(admin2);

            System.out.println("✅ 2 Admin kullanıcı eklendi");

            // ========================================
            // HAVALİMANLARI
            // ========================================
            Airport ist = createAirport("IST", "İstanbul Havalimanı", "İstanbul", "Türkiye", "Europe/Istanbul");
            Airport saw = createAirport("SAW", "Sabiha Gökçen Havalimanı", "İstanbul", "Türkiye", "Europe/Istanbul");
            Airport esb = createAirport("ESB", "Esenboğa Havalimanı", "Ankara", "Türkiye", "Europe/Istanbul");
            Airport ayt = createAirport("AYT", "Antalya Havalimanı", "Antalya", "Türkiye", "Europe/Istanbul");
            Airport adb = createAirport("ADB", "Adnan Menderes Havalimanı", "İzmir", "Türkiye", "Europe/Istanbul");
            Airport dlm = createAirport("DLM", "Dalaman Havalimanı", "Muğla", "Türkiye", "Europe/Istanbul");
            Airport bjv = createAirport("BJV", "Milas-Bodrum Havalimanı", "Muğla", "Türkiye", "Europe/Istanbul");
            Airport tzx = createAirport("TZX", "Trabzon Havalimanı", "Trabzon", "Türkiye", "Europe/Istanbul");

            airportRepository.save(ist);
            airportRepository.save(saw);
            airportRepository.save(esb);
            airportRepository.save(ayt);
            airportRepository.save(adb);
            airportRepository.save(dlm);
            airportRepository.save(bjv);
            airportRepository.save(tzx);

            System.out.println("✅ 8 Havalimanı eklendi");

            // ========================================
            // HAVAYOLU ŞİRKETLERİ
            // ========================================
            Airline thy = createAirline("Türk Hava Yolları", "Türkiye", 1500, 350, "TK", "THY");
            Airline pegasus = createAirline("Pegasus Hava Yolları", "Türkiye", 800, 100, "PC", "PGT");
            Airline anadolu = createAirline("AnadoluJet", "Türkiye", 600, 80, "TJ", "AJA");
            Airline sun = createAirline("SunExpress", "Türkiye", 400, 60, "XQ", "SXS");

            airlineRepository.save(thy);
            airlineRepository.save(pegasus);
            airlineRepository.save(anadolu);
            airlineRepository.save(sun);

            System.out.println("✅ 4 Havayolu şirketi eklendi");

            // ========================================
            // UÇAKLAR
            // ========================================
            Aircraft ac1 = createAircraft(thy, "Boeing 737-800", "TC-JFU", 151, "Boeing");
            Aircraft ac2 = createAircraft(thy, "Airbus A321", "TC-JRB", 180, "Airbus");
            Aircraft ac3 = createAircraft(thy, "Boeing 777-300ER", "TC-JJU", 349, "Boeing");
            Aircraft ac4 = createAircraft(pegasus, "Boeing 737-800", "TC-CPE", 189, "Boeing");
            Aircraft ac5 = createAircraft(pegasus, "Airbus A320neo", "TC-NBA", 186, "Airbus");
            Aircraft ac6 = createAircraft(anadolu, "Boeing 737-800", "TC-JZG", 189, "Boeing");
            Aircraft ac7 = createAircraft(anadolu, "Airbus A321", "TC-JRM", 180, "Airbus");
            Aircraft ac8 = createAircraft(sun, "Boeing 737-800", "TC-SNY", 189, "Boeing");

            aircraftRepository.save(ac1);
            aircraftRepository.save(ac2);
            aircraftRepository.save(ac3);
            aircraftRepository.save(ac4);
            aircraftRepository.save(ac5);
            aircraftRepository.save(ac6);
            aircraftRepository.save(ac7);
            aircraftRepository.save(ac8);

            System.out.println("✅ 8 Uçak eklendi");

            // ========================================
            // ÖRNEK MÜŞTERİLER
            // ========================================
            Customer c1 = createCustomer("ahmet123", "password123", "12345678901", "Ahmet Yılmaz", "1990-05-15", "Erkek", "ahmet.yilmaz@example.com", "05321234567");
            Customer c2 = createCustomer("ayse456", "password123", "12345678902", "Ayşe Demir", "1988-08-20", "Kadın", "ayse.demir@example.com", "05339876543");
            Customer c3 = createCustomer("mehmet789", "password123", "12345678903", "Mehmet Kaya", "1995-03-10", "Erkek", "mehmet.kaya@example.com", "05357654321");
            Customer c4 = createCustomer("fatma012", "password123", "12345678904", "Fatma Şahin", "1992-11-25", "Kadın", "fatma.sahin@example.com", "05441234567");

            customerRepository.save(c1);
            customerRepository.save(c2);
            customerRepository.save(c3);
            customerRepository.save(c4);

            System.out.println("✅ 4 Örnek müşteri eklendi");

            // ========================================
            // UÇUŞLAR
            // ========================================
            // İstanbul -> Ankara
            flightRepository.save(createFlight(thy, ac1, ist, esb, "2025-12-01 08:00", "2025-12-01 09:15", 850));
            flightRepository.save(createFlight(pegasus, ac4, ist, esb, "2025-12-01 10:30", "2025-12-01 11:45", 650));
            flightRepository.save(createFlight(anadolu, ac6, ist, esb, "2025-12-01 14:00", "2025-12-01 15:15", 550));
            flightRepository.save(createFlight(thy, ac2, ist, esb, "2025-12-01 18:30", "2025-12-01 19:45", 900));

            // İstanbul -> Antalya
            flightRepository.save(createFlight(thy, ac3, ist, ayt, "2025-12-01 09:00", "2025-12-01 10:30", 1200));
            flightRepository.save(createFlight(pegasus, ac5, ist, ayt, "2025-12-01 12:00", "2025-12-01 13:30", 950));
            flightRepository.save(createFlight(sun, ac8, ist, ayt, "2025-12-01 15:30", "2025-12-01 17:00", 880));
            flightRepository.save(createFlight(anadolu, ac7, ist, ayt, "2025-12-01 19:00", "2025-12-01 20:30", 800));

            // İstanbul -> İzmir
            flightRepository.save(createFlight(thy, ac1, ist, adb, "2025-12-01 07:30", "2025-12-01 08:45", 950));
            flightRepository.save(createFlight(pegasus, ac4, ist, adb, "2025-12-01 11:00", "2025-12-01 12:15", 750));
            flightRepository.save(createFlight(anadolu, ac6, ist, adb, "2025-12-01 16:30", "2025-12-01 17:45", 700));

            // Ankara -> İzmir
            flightRepository.save(createFlight(thy, ac2, esb, adb, "2025-12-01 09:00", "2025-12-01 10:30", 850));
            flightRepository.save(createFlight(pegasus, ac5, esb, adb, "2025-12-01 13:30", "2025-12-01 15:00", 680));

            // İzmir -> Antalya
            flightRepository.save(createFlight(thy, ac2, adb, ayt, "2025-12-01 10:00", "2025-12-01 11:15", 750));
            flightRepository.save(createFlight(sun, ac8, adb, ayt, "2025-12-01 14:30", "2025-12-01 15:45", 650));

            // Sabiha Gökçen -> Antalya
            flightRepository.save(createFlight(pegasus, ac5, saw, ayt, "2025-12-01 08:00", "2025-12-01 09:30", 900));
            flightRepository.save(createFlight(anadolu, ac7, saw, ayt, "2025-12-01 13:00", "2025-12-01 14:30", 750));

            // İstanbul -> Bodrum
            flightRepository.save(createFlight(thy, ac1, ist, bjv, "2025-12-01 10:30", "2025-12-01 11:45", 1100));
            flightRepository.save(createFlight(pegasus, ac4, ist, bjv, "2025-12-01 15:00", "2025-12-01 16:15", 850));

            // İstanbul -> Trabzon
            flightRepository.save(createFlight(thy, ac2, ist, tzx, "2025-12-01 06:30", "2025-12-01 08:30", 950));
            flightRepository.save(createFlight(anadolu, ac6, ist, tzx, "2025-12-01 11:00", "2025-12-01 13:00", 750));

            // 2 Aralık
            flightRepository.save(createFlight(thy, ac1, ist, esb, "2025-12-02 08:00", "2025-12-02 09:15", 850));
            flightRepository.save(createFlight(pegasus, ac4, ist, esb, "2025-12-02 10:30", "2025-12-02 11:45", 650));
            flightRepository.save(createFlight(thy, ac3, ist, ayt, "2025-12-02 09:00", "2025-12-02 10:30", 1200));
            flightRepository.save(createFlight(pegasus, ac5, ist, ayt, "2025-12-02 12:00", "2025-12-02 13:30", 950));
            flightRepository.save(createFlight(thy, ac1, ist, adb, "2025-12-02 07:30", "2025-12-02 08:45", 950));

            // 3 Aralık
            flightRepository.save(createFlight(thy, ac1, ist, esb, "2025-12-03 08:00", "2025-12-03 09:15", 850));
            flightRepository.save(createFlight(pegasus, ac4, ist, esb, "2025-12-03 10:30", "2025-12-03 11:45", 650));
            flightRepository.save(createFlight(thy, ac3, ist, ayt, "2025-12-03 09:00", "2025-12-03 10:30", 1200));

            System.out.println("✅ 30 Uçuş eklendi");

            // ========================================
            // AKTARMALI UÇUŞLAR
            // ========================================
            // İstanbul'dan Ankara'ya aktarmalı uçuş (1 Aralık 2025, İzmir üzerinden)
            Flight layoverFlight1 = createLayoverFlight(
                thy, ac1, ist, esb, adb,
                "2025-12-01 09:00", "2025-12-01 12:30",
                75, 1800.0
            );
            flightRepository.save(layoverFlight1);
            System.out.println("✅ 1 Aktarmalı uçuş eklendi (IST -> ADB -> ESB, 1 Aralık 2025)");

            // ========================================
            // ÖRNEK REZERVASYONLAR
            // ========================================
            Flight flight1 = flightRepository.findAll().get(0);
            Flight flight2 = flightRepository.findAll().get(4);
            Flight flight3 = flightRepository.findAll().get(8);
            Flight flight4 = flightRepository.findAll().get(11);

            Reservation r1 = createReservation("PNRABC123", c1, flight1, "12A", "2025-11-20 10:30:00", "CONFIRMED");
            Reservation r2 = createReservation("PNRDEF456", c2, flight2, "8C", "2025-11-21 14:20:00", "CONFIRMED");
            Reservation r3 = createReservation("PNRGHI789", c3, flight3, "15F", "2025-11-22 09:15:00", "CONFIRMED");
            Reservation r4 = createReservation("PNRJKL012", c4, flight4, "20B", "2025-11-23 16:45:00", "CONFIRMED");

            reservationRepository.save(r1);
            reservationRepository.save(r2);
            reservationRepository.save(r3);
            reservationRepository.save(r4);

            System.out.println("✅ 4 Rezervasyon eklendi");

            // ========================================
            // ÖRNEK ÖDEMELER
            // ========================================
            paymentRepository.save(createPayment(r1, "Credit Card", "TRY", 850, "2025-11-20 10:35:00", "COMPLETED"));
            paymentRepository.save(createPayment(r2, "Credit Card", "TRY", 1200, "2025-11-21 14:25:00", "COMPLETED"));
            paymentRepository.save(createPayment(r3, "Credit Card", "TRY", 950, "2025-11-22 09:20:00", "COMPLETED"));
            paymentRepository.save(createPayment(r4, "Credit Card", "TRY", 850, "2025-11-23 16:50:00", "COMPLETED"));

            System.out.println("✅ 4 Ödeme eklendi");

            System.out.println("\n🎉 TÜM VERİLER BAŞARIYLA YÜKLENDİ!");
            System.out.println("📊 Özet:");
            System.out.println("   - 2 Admin kullanıcı");
            System.out.println("   - 8 Havalimanı");
            System.out.println("   - 4 Havayolu");
            System.out.println("   - 8 Uçak");
            System.out.println("   - 4 Müşteri");
            System.out.println("   - 30 Uçuş");
            System.out.println("   - 4 Rezervasyon");
            System.out.println("   - 4 Ödeme");
            System.out.println("\n🚀 Backend hazır! Frontend'den test edebilirsiniz.");
            System.out.println("🔑 Admin: admin / admin123");
        };
    }

    // Helper metodlar
    private Airport createAirport(String code, String name, String city, String country, String timeZone) {
        Airport airport = new Airport();
        airport.setCode(code);
        airport.setName(name);
        airport.setCity(city);
        airport.setCountry(country);
        airport.setTimeZone(timeZone);
        return airport;
    }

    private Airline createAirline(String name, String ulke, Integer ucusSayisi, Integer ucakSayisi, String iataCode, String icaoCode) {
        Airline airline = new Airline();
        airline.setName(name);
        airline.setUlke(ulke);
        airline.setUcusSayisi(ucusSayisi);
        airline.setUcakSayisi(ucakSayisi);
        airline.setIataCode(iataCode);
        airline.setIcaoCode(icaoCode);
        return airline;
    }

    private Aircraft createAircraft(Airline airline, String model, String tailNumber, Integer capacity, String uretici) {
        Aircraft aircraft = new Aircraft();
        aircraft.setAirline(airline);
        aircraft.setModel(model);
        aircraft.setTailNumber(tailNumber);
        aircraft.setCapacity(capacity);
        aircraft.setUretici(uretici);
        return aircraft;
    }

    private Customer createCustomer(String username, String password, String tcNo, String isimSoyad, String dogumTarihi, String cinsiyet, String mail, String telNo) {
        Customer customer = new Customer();
        customer.setUsername(username);
        customer.setPassword(password);
        customer.setTcNo(tcNo);
        customer.setIsimSoyad(isimSoyad);
        customer.setDogumTarihi(LocalDate.parse(dogumTarihi));
        customer.setUyruk("Türkiye");
        customer.setCinsiyet(cinsiyet);
        customer.setMail(mail);
        customer.setTelNo(telNo);
        return customer;
    }

    private Flight createFlight(Airline airline, Aircraft aircraft, Airport origin, Airport destination, 
                                String kalkis, String inis, double price) {
        Flight flight = new Flight();
        flight.setAirline(airline);
        flight.setAircraft(aircraft);
        flight.setOriginAirport(origin);
        flight.setDestinationAirport(destination);
        flight.setKalkisTarihi(LocalDateTime.parse(kalkis.replace(" ", "T")));
        flight.setInisTarihi(LocalDateTime.parse(inis.replace(" ", "T")));
        flight.setBasePrice(BigDecimal.valueOf(price));
        flight.setHasLayover(false);
        return flight;
    }
    
    private Flight createLayoverFlight(Airline airline, Aircraft aircraft, Airport origin, Airport destination,
                                       Airport layoverAirport, String kalkis, String inis,
                                       int layoverDurationMinutes, double price) {
        Flight flight = new Flight();
        flight.setAirline(airline);
        flight.setAircraft(aircraft);
        flight.setOriginAirport(origin);
        flight.setDestinationAirport(destination);
        flight.setKalkisTarihi(LocalDateTime.parse(kalkis.replace(" ", "T")));
        flight.setInisTarihi(LocalDateTime.parse(inis.replace(" ", "T")));
        flight.setBasePrice(BigDecimal.valueOf(price));
        flight.setHasLayover(true);
        flight.setLayoverAirport(layoverAirport);
        flight.setLayoverDurationMinutes(layoverDurationMinutes);
        return flight;
    }

    private Reservation createReservation(String pnr, Customer customer, Flight flight, String seat, 
                                         String date, String status) {
        Reservation reservation = new Reservation();
        reservation.setPnr(pnr);
        reservation.setCustomer(customer);
        reservation.setFlight(flight);
        reservation.setSeatNumber(seat);
        reservation.setReservationDate(LocalDateTime.parse(date.replace(" ", "T")));
        reservation.setStatus(status);
        return reservation;
    }

    private Payment createPayment(Reservation reservation, String method, String currency, 
                                  double amount, String time, String status) {
        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setMethod(method);
        payment.setCurrency(currency);
        payment.setAmount(BigDecimal.valueOf(amount));
        payment.setPaymentTime(LocalDateTime.parse(time.replace(" ", "T")));
        payment.setPaymentStatus(status);
        return payment;
    }
}


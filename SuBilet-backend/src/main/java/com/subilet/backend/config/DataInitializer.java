package com.subilet.backend.config;

import com.subilet.backend.entity.*;
import com.subilet.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer {

    private final Random random = new Random(42); // Sabit seed ile tekrarlanabilir sonuçlar

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
            // HAVALİMANLARI (15 Havalimanı)
            // ========================================
            List<Airport> airports = new ArrayList<>();
            
            airports.add(createAirport("IST", "İstanbul Havalimanı", "İstanbul", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("SAW", "Sabiha Gökçen Havalimanı", "İstanbul", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("ESB", "Esenboğa Havalimanı", "Ankara", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("AYT", "Antalya Havalimanı", "Antalya", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("ADB", "Adnan Menderes Havalimanı", "İzmir", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("DLM", "Dalaman Havalimanı", "Muğla", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("BJV", "Milas-Bodrum Havalimanı", "Muğla", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("TZX", "Trabzon Havalimanı", "Trabzon", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("GZT", "Gaziantep Havalimanı", "Gaziantep", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("ADA", "Adana Havalimanı", "Adana", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("VAN", "Ferit Melen Havalimanı", "Van", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("ERZ", "Erzurum Havalimanı", "Erzurum", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("DIY", "Diyarbakır Havalimanı", "Diyarbakır", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("KYA", "Konya Havalimanı", "Konya", "Türkiye", "Europe/Istanbul"));
            airports.add(createAirport("SZF", "Samsun-Çarşamba Havalimanı", "Samsun", "Türkiye", "Europe/Istanbul"));

            for (Airport airport : airports) {
                airportRepository.save(airport);
            }
            System.out.println("✅ " + airports.size() + " Havalimanı eklendi");

            // ========================================
            // HAVAYOLU ŞİRKETLERİ (4 Havayolu)
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
            // UÇAKLAR (12 Uçak - Her havayoluna 3'er)
            // ========================================
            List<Aircraft> aircrafts = new ArrayList<>();
            
            // THY Uçakları (3 adet)
            aircrafts.add(createAircraft(thy, "Boeing 737-800", "TC-JFU", 151, "Boeing"));
            aircrafts.add(createAircraft(thy, "Airbus A321", "TC-JRB", 180, "Airbus"));
            aircrafts.add(createAircraft(thy, "Boeing 777-300ER", "TC-JJU", 349, "Boeing"));
            
            // Pegasus Uçakları (3 adet)
            aircrafts.add(createAircraft(pegasus, "Boeing 737-800", "TC-CPE", 189, "Boeing"));
            aircrafts.add(createAircraft(pegasus, "Airbus A320neo", "TC-NBA", 186, "Airbus"));
            aircrafts.add(createAircraft(pegasus, "Boeing 737 MAX 8", "TC-RBA", 189, "Boeing"));
            
            // AnadoluJet Uçakları (3 adet)
            aircrafts.add(createAircraft(anadolu, "Boeing 737-800", "TC-JZG", 189, "Boeing"));
            aircrafts.add(createAircraft(anadolu, "Airbus A321", "TC-JRM", 180, "Airbus"));
            aircrafts.add(createAircraft(anadolu, "Boeing 737-800", "TC-JZH", 189, "Boeing"));
            
            // SunExpress Uçakları (3 adet)
            aircrafts.add(createAircraft(sun, "Boeing 737-800", "TC-SNY", 189, "Boeing"));
            aircrafts.add(createAircraft(sun, "Boeing 737 MAX 8", "TC-SNA", 189, "Boeing"));
            aircrafts.add(createAircraft(sun, "Boeing 737-800", "TC-SNZ", 189, "Boeing"));

            for (Aircraft aircraft : aircrafts) {
                aircraftRepository.save(aircraft);
            }
            System.out.println("✅ " + aircrafts.size() + " Uçak eklendi");

            // ========================================
            // ÖRNEK MÜŞTERİLER (5 Müşteri)
            // ========================================
            List<Customer> customers = new ArrayList<>();
            
            customers.add(createCustomer("ahmet123", "password123", "12345678901", "Ahmet Yılmaz", "1990-05-15", "Erkek", "ahmet.yilmaz@example.com", "05321234567"));
            customers.add(createCustomer("ayse456", "password123", "12345678902", "Ayşe Demir", "1988-08-20", "Kadın", "ayse.demir@example.com", "05339876543"));
            customers.add(createCustomer("mehmet789", "password123", "12345678903", "Mehmet Kaya", "1995-03-10", "Erkek", "mehmet.kaya@example.com", "05357654321"));
            customers.add(createCustomer("fatma012", "password123", "12345678904", "Fatma Şahin", "1992-11-25", "Kadın", "fatma.sahin@example.com", "05441234567"));
            customers.add(createCustomer("ali345", "password123", "12345678905", "Ali Çelik", "1987-07-12", "Erkek", "ali.celik@example.com", "05359876543"));

            for (Customer customer : customers) {
                customerRepository.save(customer);
            }
            System.out.println("✅ " + customers.size() + " Örnek müşteri eklendi");

            // ========================================
            // UÇUŞLAR (250 Direkt Uçuş)
            // ========================================
            List<Flight> flights = new ArrayList<>();
            
            // Fiyat aralıkları (TL)
            double[] thyPrices = {850, 950, 1050, 1150, 1250, 1350, 1450, 1550};
            double[] pegasusPrices = {550, 650, 750, 850, 950, 1050, 1150};
            double[] anadoluPrices = {450, 550, 650, 750, 850, 950};
            double[] sunPrices = {500, 600, 700, 800, 900, 1000};

            // Uçak listeleri
            Aircraft[] thyAircrafts = {aircrafts.get(0), aircrafts.get(1), aircrafts.get(2)};
            Aircraft[] pegasusAircrafts = {aircrafts.get(3), aircrafts.get(4), aircrafts.get(5)};
            Aircraft[] anadoluAircrafts = {aircrafts.get(6), aircrafts.get(7), aircrafts.get(8)};
            Aircraft[] sunAircrafts = {aircrafts.get(9), aircrafts.get(10), aircrafts.get(11)};

            // 1-10 Aralık 2025 için uçuşlar (toplam 250 direkt uçuş)
            int flightCount = 0;
            int targetDirectFlights = 250;
            
            for (int day = 1; day <= 10 && flightCount < targetDirectFlights; day++) {
                String dateStr = String.format("2025-12-%02d", day);
                
                // Her havalimanından diğer havalimanlarına uçuşlar oluştur
                for (int i = 0; i < airports.size() && flightCount < targetDirectFlights; i++) {
                    Airport origin = airports.get(i);
                    
                    // Her havalimanından 1-2 farklı destinasyona uçuş (250'yi geçmemek için)
                    int flightsPerOrigin = (i < 5) ? 2 : 1; // İlk 5 havalimanı daha fazla
                    
                    for (int j = 0; j < flightsPerOrigin && flightCount < targetDirectFlights; j++) {
                        // Aynı havalimanına gitme
                        int destIndex = (i + j + 1) % airports.size();
                        if (destIndex == i) {
                            destIndex = (destIndex + 1) % airports.size();
                        }
                        Airport destination = airports.get(destIndex);
                        
                        // Havayolu seçimi (rastgele)
                        int airlineIndex = random.nextInt(4);
                        Airline airline;
                        Aircraft aircraft;
                        double price;
                        
                        switch (airlineIndex) {
                            case 0:
                                airline = thy;
                                aircraft = thyAircrafts[random.nextInt(thyAircrafts.length)];
                                price = thyPrices[random.nextInt(thyPrices.length)];
                                break;
                            case 1:
                                airline = pegasus;
                                aircraft = pegasusAircrafts[random.nextInt(pegasusAircrafts.length)];
                                price = pegasusPrices[random.nextInt(pegasusPrices.length)];
                                break;
                            case 2:
                                airline = anadolu;
                                aircraft = anadoluAircrafts[random.nextInt(anadoluAircrafts.length)];
                                price = anadoluPrices[random.nextInt(anadoluPrices.length)];
                                break;
                            default:
                                airline = sun;
                                aircraft = sunAircrafts[random.nextInt(sunAircrafts.length)];
                                price = sunPrices[random.nextInt(sunPrices.length)];
                                break;
                        }
                        
                        // Uçuş saatleri (06:00 - 22:00 arası)
                        int hour = 6 + (j * 4) + random.nextInt(2);
                        if (hour > 22) hour = 6 + random.nextInt(16);
                        int minute = random.nextInt(4) * 15; // 0, 15, 30, 45
                        
                        // Uçuş süresi hesapla (mesafeye göre yaklaşık)
                        int flightDurationMinutes = calculateFlightDuration(origin, destination);
                        int arrivalHour = hour + (flightDurationMinutes / 60);
                        int arrivalMinute = minute + (flightDurationMinutes % 60);
                        if (arrivalMinute >= 60) {
                            arrivalHour++;
                            arrivalMinute -= 60;
                        }
                        
                        String kalkis = String.format("%s %02d:%02d", dateStr, hour, minute);
                        String inis = String.format("%s %02d:%02d", dateStr, arrivalHour, arrivalMinute);
                        
                        try {
                            flights.add(createFlight(airline, aircraft, origin, destination, kalkis, inis, price));
                            flightCount++;
                        } catch (Exception e) {
                            System.err.println("Uçuş oluşturulurken hata: " + e.getMessage());
                        }
                    }
                }
            }

            // Tüm direkt uçuşları kaydet
            for (Flight flight : flights) {
                flightRepository.save(flight);
            }
            System.out.println("✅ " + flights.size() + " Direkt uçuş eklendi");

            // ========================================
            // AKTARMALI UÇUŞLAR (50 Aktarmalı Uçuş)
            // ========================================
            List<Flight> layoverFlights = new ArrayList<>();
            int layoverCount = 0;
            int targetLayoverFlights = 50;
            
            // 1-10 Aralık için aktarmalı uçuşlar (günde 5 aktarmalı)
            for (int day = 1; day <= 10 && layoverCount < targetLayoverFlights; day++) {
                String dateStr = String.format("2025-12-%02d", day);
                
                for (int k = 0; k < 5 && layoverCount < targetLayoverFlights; k++) {
                    try {
                        // Rastgele origin ve destination seç
                        int originIdx = random.nextInt(airports.size());
                        int destIdx = random.nextInt(airports.size());
                        
                        // Aynı havalimanına gitme
                        while (destIdx == originIdx) {
                            destIdx = random.nextInt(airports.size());
                        }
                        
                        // Aktarma havalimanı seç (origin ve destination'dan farklı)
                        int layoverIdx = random.nextInt(airports.size());
                        int attempts = 0;
                        while ((layoverIdx == originIdx || layoverIdx == destIdx) && attempts < 10) {
                            layoverIdx = random.nextInt(airports.size());
                            attempts++;
                        }
                        if (attempts >= 10) {
                            continue; // Aktarma havalimanı bulunamadı, atla
                        }
                        
                        Airport origin = airports.get(originIdx);
                        Airport destination = airports.get(destIdx);
                        Airport layover = airports.get(layoverIdx);
                        
                        // Havayolu seçimi
                        int airlineIndex = random.nextInt(4);
                        Airline airline;
                        Aircraft aircraft;
                        double price;
                        
                        switch (airlineIndex) {
                            case 0:
                                airline = thy;
                                aircraft = thyAircrafts[random.nextInt(thyAircrafts.length)];
                                price = thyPrices[random.nextInt(thyPrices.length)] * 1.5; // Aktarmalı daha pahalı
                                break;
                            case 1:
                                airline = pegasus;
                                aircraft = pegasusAircrafts[random.nextInt(pegasusAircrafts.length)];
                                price = pegasusPrices[random.nextInt(pegasusPrices.length)] * 1.5;
                                break;
                            case 2:
                                airline = anadolu;
                                aircraft = anadoluAircrafts[random.nextInt(anadoluAircrafts.length)];
                                price = anadoluPrices[random.nextInt(anadoluPrices.length)] * 1.5;
                                break;
                            default:
                                airline = sun;
                                aircraft = sunAircrafts[random.nextInt(sunAircrafts.length)];
                                price = sunPrices[random.nextInt(sunPrices.length)] * 1.5;
                                break;
                        }
                        
                        // Uçuş saatleri
                        int hour = 7 + (k * 3) + random.nextInt(2);
                        if (hour > 20) hour = 7 + random.nextInt(13);
                        int minute = random.nextInt(4) * 15;
                        
                        // Toplam uçuş süresi (origin -> layover -> destination)
                        int totalDuration = calculateFlightDuration(origin, layover) + 
                                           calculateFlightDuration(layover, destination) + 
                                           90; // 90 dakika aktarma süresi
                        
                        int arrivalHour = hour + (totalDuration / 60);
                        int arrivalMinute = minute + (totalDuration % 60);
                        if (arrivalMinute >= 60) {
                            arrivalHour++;
                            arrivalMinute -= 60;
                        }
                        
                        // Ertesi güne geçmemesi için kontrol
                        if (arrivalHour >= 24) {
                            arrivalHour = arrivalHour % 24;
                        }
                        
                        String kalkis = String.format("%s %02d:%02d", dateStr, hour, minute);
                        String inis = String.format("%s %02d:%02d", dateStr, arrivalHour, arrivalMinute);
                        
                        layoverFlights.add(createLayoverFlight(airline, aircraft, origin, destination, layover,
                            kalkis, inis, 90, price));
                        layoverCount++;
                    } catch (Exception e) {
                        System.err.println("Aktarmalı uçuş oluşturulurken hata: " + e.getMessage());
                    }
                }
            }

            // Aktarmalı uçuşları kaydet
            for (Flight layoverFlight : layoverFlights) {
                try {
                    flightRepository.save(layoverFlight);
                } catch (Exception e) {
                    System.err.println("Aktarmalı uçuş kaydedilirken hata: " + e.getMessage());
                }
            }
            System.out.println("✅ " + layoverFlights.size() + " Aktarmalı uçuş eklendi");

            int totalFlights = flights.size() + layoverFlights.size();
            System.out.println("✅ TOPLAM " + totalFlights + " Uçuş eklendi");

            // ========================================
            // ÖRNEK REZERVASYONLAR (250 uçuşta rezervasyon)
            // ========================================
            List<Reservation> reservations = new ArrayList<>();
            List<Flight> savedFlights = flightRepository.findAll();
            
            // İlk 250 uçuşa rezervasyon ekle (50'sinde rezervasyon olmayacak)
            String[] seatNumbers = {"1A", "2B", "3C", "4D", "5E", "6F", "7A", "8B", "9C", "10D", 
                                   "11A", "12B", "13C", "14D", "15E", "16F", "17A", "18B", "19C", "20D"};
            
            int reservationCount = 0;
            int maxReservations = Math.min(250, savedFlights.size());
            
            for (int i = 0; i < maxReservations; i++) {
                try {
                    Flight flight = savedFlights.get(i);
                    if (flight == null || flight.getKalkisTarihi() == null) {
                        continue;
                    }
                    
                    Customer customer = customers.get(i % customers.size()); // Müşterileri döngüsel kullan
                    String pnr = "PNR" + String.format("%06d", 100000 + i);
                    
                    // Rezervasyon tarihi (uçuştan 1-15 gün önce, güvenli bir tarih)
                    int daysBefore = 1 + (i % 15);
                    LocalDateTime flightDate = flight.getKalkisTarihi();
                    LocalDateTime reservationDate = flightDate.minusDays(daysBefore);
                    
                    // Eğer rezervasyon tarihi çok eskiyse, uçuş tarihinden 1 gün önce yap
                    if (reservationDate.isBefore(LocalDateTime.now().minusMonths(1))) {
                        reservationDate = flightDate.minusDays(1);
                    }
                    
                    String seat = seatNumbers[i % seatNumbers.length];
                    Reservation reservation = createReservation(pnr, customer, flight, seat, 
                        reservationDate.toString().replace("T", " ").substring(0, 19), "CONFIRMED");
                    reservations.add(reservation);
                    reservationCount++;
                } catch (Exception e) {
                    System.err.println("Rezervasyon oluşturulurken hata (uçuş " + i + "): " + e.getMessage());
                    e.printStackTrace();
                }
            }

            for (Reservation reservation : reservations) {
                try {
                    reservationRepository.save(reservation);
                } catch (Exception e) {
                    System.err.println("Rezervasyon kaydedilirken hata: " + e.getMessage());
                }
            }
            System.out.println("✅ " + reservations.size() + " Rezervasyon eklendi (250 uçuşta rezervasyon var, 50'sinde yok)");

            // ========================================
            // ÖRNEK ÖDEMELER
            // ========================================
            List<Reservation> savedReservations = reservationRepository.findAll();
            int paymentCount = 0;
            
            for (Reservation reservation : savedReservations) {
                try {
                    if (reservation == null || reservation.getReservationDate() == null || reservation.getFlight() == null) {
                        continue;
                    }
                    LocalDateTime paymentDate = reservation.getReservationDate().plusMinutes(5);
                    Payment payment = createPayment(reservation, "Credit Card", "TRY", 
                        reservation.getFlight().getBasePrice().doubleValue(), 
                        paymentDate.toString().replace("T", " ").substring(0, 19), "COMPLETED");
                    paymentRepository.save(payment);
                    paymentCount++;
                } catch (Exception e) {
                    System.err.println("Ödeme oluşturulurken hata: " + e.getMessage());
                }
            }
            System.out.println("✅ " + paymentCount + " Örnek ödeme eklendi");

            // ========================================
            // ÖZET
            // ========================================
            System.out.println("\n🎉 TÜM VERİLER BAŞARIYLA YÜKLENDİ!");
            System.out.println("📊 Özet:");
            System.out.println("   - 2 Admin kullanıcı");
            System.out.println("   - " + airports.size() + " Havalimanı");
            System.out.println("   - 4 Havayolu");
            System.out.println("   - " + aircrafts.size() + " Uçak");
            System.out.println("   - " + customers.size() + " Müşteri");
            System.out.println("   - " + totalFlights + " Uçuş (" + flights.size() + " direkt + " + layoverFlights.size() + " aktarmalı)");
            System.out.println("   - " + reservations.size() + " Rezervasyon (250 uçuşta var, 50'sinde yok)");
            System.out.println("   - " + paymentCount + " Ödeme");
            System.out.println("\n🚀 Backend hazır! Frontend'den test edebilirsiniz.");
            System.out.println("🔑 Admin: admin / admin123");
            System.out.println("📝 NOT: 50 uçuşta rezervasyon yok - kendiniz oluşturabilirsiniz!");
        };
    }

    // Uçuş süresi hesaplama (yaklaşık - mesafeye göre)
    private int calculateFlightDuration(Airport origin, Airport destination) {
        // Basit bir mesafe tahmini (gerçek mesafeye göre değil, örnek için)
        // İstanbul merkezli düşünürsek:
        String originCode = origin.getCode();
        String destCode = destination.getCode();
        
        // Aynı şehir içi (IST <-> SAW)
        if ((originCode.equals("IST") && destCode.equals("SAW")) || 
            (originCode.equals("SAW") && destCode.equals("IST"))) {
            return 45; // 45 dakika
        }
        
        // Kısa mesafe (1-1.5 saat)
        if (originCode.startsWith("I") || destCode.startsWith("I") || 
            originCode.equals("ESB") || destCode.equals("ESB") ||
            originCode.equals("ADB") || destCode.equals("ADB")) {
            return 60 + (int)(Math.random() * 30); // 60-90 dakika
        }
        
        // Orta mesafe (1.5-2 saat)
        if (originCode.equals("AYT") || destCode.equals("AYT") ||
            originCode.equals("DLM") || destCode.equals("DLM") ||
            originCode.equals("BJV") || destCode.equals("BJV")) {
            return 90 + (int)(Math.random() * 30); // 90-120 dakika
        }
        
        // Uzun mesafe (2-3 saat)
        return 120 + (int)(Math.random() * 60); // 120-180 dakika
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

package com.subilet.backend.config;

import com.subilet.backend.entity.*;
import com.subilet.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            AdminRepository adminRepository,
            CityRepository cityRepository,
            AirportRepository airportRepository,
            AirlineRepository airlineRepository,
            AircraftTypeRepository aircraftTypeRepository,
            CustomerRepository customerRepository) {

        return args -> {
            // Veritabanı boş mu kontrol et - Admin tablosu boşsa başlangıç verilerini yükle
            if (adminRepository.count() > 0) {
                System.out.println("ℹ️ Veritabanında veri mevcut. DataInitializer atlanıyor...");
                return;
            }

            System.out.println("🚀 ŞUBİLET - Başlangıç Verileri Yükleniyor...");

            // ========================================
            // ADMIN KULLANICISI (1 Admin)
            // ========================================
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setFullName("Sistem Yöneticisi");
            adminRepository.save(admin);
            Admin admin1 = new Admin();
            admin.setUsername("cansu");
            admin.setPassword("cansu123");
            admin.setFullName("Saadetcansu");
            adminRepository.save(admin);
            Admin admin2 = new Admin();
            admin.setUsername("ato");
            admin.setPassword("ato123");
            admin.setFullName("AhmetTaha");
            adminRepository.save(admin);
            Admin admin3 = new Admin();
            admin.setUsername("tuna");
            admin.setPassword("tuna123");
            admin.setFullName("Tuna");
            adminRepository.save(admin);




            System.out.println("✅ 1 Admin kullanıcı eklendi (admin / admin123)");

            // ========================================
            // ŞEHİRLER (Türkiye'nin 81 İli)
            // ========================================
            String[] turkiyeIlleri = {
                "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
                "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
                "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
                "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta",
                "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
                "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla",
                "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt",
                "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
                "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman",
                "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
            };
            
            List<City> allCities = new ArrayList<>();
            for (String ilAdi : turkiyeIlleri) {
                City city = createCity(ilAdi, "Türkiye", "Europe/Istanbul");
                cityRepository.save(city);
                allCities.add(city);
            }
            
            // Havalimanı oluşturmak için sık kullanılan şehirleri referans olarak al
            City istanbul = allCities.stream().filter(c -> c.getCity().equals("İstanbul")).findFirst().orElse(allCities.get(33));
            City ankara = allCities.stream().filter(c -> c.getCity().equals("Ankara")).findFirst().orElse(allCities.get(5));
            City antalya = allCities.stream().filter(c -> c.getCity().equals("Antalya")).findFirst().orElse(allCities.get(6));
            City izmir = allCities.stream().filter(c -> c.getCity().equals("İzmir")).findFirst().orElse(allCities.get(34));
            City mugla = allCities.stream().filter(c -> c.getCity().equals("Muğla")).findFirst().orElse(allCities.get(47));
            City trabzon = allCities.stream().filter(c -> c.getCity().equals("Trabzon")).findFirst().orElse(allCities.get(60));
            City gaziantep = allCities.stream().filter(c -> c.getCity().equals("Gaziantep")).findFirst().orElse(allCities.get(26));
            City adana = allCities.stream().filter(c -> c.getCity().equals("Adana")).findFirst().orElse(allCities.get(0));
            City van = allCities.stream().filter(c -> c.getCity().equals("Van")).findFirst().orElse(allCities.get(64));
            City erzurum = allCities.stream().filter(c -> c.getCity().equals("Erzurum")).findFirst().orElse(allCities.get(24));
            City diyarbakir = allCities.stream().filter(c -> c.getCity().equals("Diyarbakır")).findFirst().orElse(allCities.get(20));
            City konya = allCities.stream().filter(c -> c.getCity().equals("Konya")).findFirst().orElse(allCities.get(41));
            City samsun = allCities.stream().filter(c -> c.getCity().equals("Samsun")).findFirst().orElse(allCities.get(54));

            System.out.println("✅ " + allCities.size() + " Şehir eklendi (Türkiye'nin 81 ili)");

            // ========================================
            // HAVALİMANLARI (15 Havalimanı)
            // ========================================
            List<Airport> airports = new ArrayList<>();
            
            airports.add(createAirport("IST", "İstanbul Havalimanı", istanbul));
            airports.add(createAirport("SAW", "Sabiha Gökçen Havalimanı", istanbul));
            airports.add(createAirport("ESB", "Esenboğa Havalimanı", ankara));
            airports.add(createAirport("AYT", "Antalya Havalimanı", antalya));
            airports.add(createAirport("ADB", "Adnan Menderes Havalimanı", izmir));
            airports.add(createAirport("DLM", "Dalaman Havalimanı", mugla));
            airports.add(createAirport("BJV", "Milas-Bodrum Havalimanı", mugla));
            airports.add(createAirport("TZX", "Trabzon Havalimanı", trabzon));
            airports.add(createAirport("GZT", "Gaziantep Havalimanı", gaziantep));
            airports.add(createAirport("ADA", "Adana Havalimanı", adana));
            airports.add(createAirport("VAN", "Ferit Melen Havalimanı", van));
            airports.add(createAirport("ERZ", "Erzurum Havalimanı", erzurum));
            airports.add(createAirport("DIY", "Diyarbakır Havalimanı", diyarbakir));
            airports.add(createAirport("KYA", "Konya Havalimanı", konya));
            airports.add(createAirport("SZF", "Samsun-Çarşamba Havalimanı", samsun));

            for (Airport airport : airports) {
                airportRepository.save(airport);
            }
            System.out.println("✅ " + airports.size() + " Havalimanı eklendi");

            // ========================================
            // HAVAYOLU ŞİRKETLERİ (4 Havayolu - ucakSayisi=0, yillikUcusSayisi)
            // ========================================
            // Yıllık uçuş sayıları gerçekçi değerler
            Airline thy = createAirline("Türk Hava Yolları", "Türkiye", 400000, 0, "TK", "THY");
            Airline pegasus = createAirline("Pegasus Hava Yolları", "Türkiye", 180000, 0, "PC", "PGT");
            Airline anadolu = createAirline("AnadoluJet", "Türkiye", 120000, 0, "TJ", "AJA");
            Airline sun = createAirline("SunExpress", "Türkiye", 80000, 0, "XQ", "SXS");

            airlineRepository.save(thy);
            airlineRepository.save(pegasus);
            airlineRepository.save(anadolu);
            airlineRepository.save(sun);

            System.out.println("✅ 4 Havayolu şirketi eklendi (uçak sayısı: 0 - manuel eklenecek)");

            // ========================================
            // UÇAK TÜRLERİ (20 Farklı Model)
            // ========================================
            List<AircraftType> aircraftTypes = new ArrayList<>();
            
            // Boeing Modelleri
            aircraftTypes.add(createAircraftType("Boeing 737-800", "Boeing", 189, 5765, 842));
            aircraftTypes.add(createAircraftType("Boeing 737 MAX 8", "Boeing", 178, 6570, 839));
            aircraftTypes.add(createAircraftType("Boeing 737 MAX 9", "Boeing", 193, 6570, 839));
            aircraftTypes.add(createAircraftType("Boeing 777-300ER", "Boeing", 396, 13650, 905));
            aircraftTypes.add(createAircraftType("Boeing 787-9 Dreamliner", "Boeing", 296, 14140, 903));
            aircraftTypes.add(createAircraftType("Boeing 767-300ER", "Boeing", 269, 11070, 850));
            aircraftTypes.add(createAircraftType("Boeing 757-200", "Boeing", 200, 7222, 850));
            
            // Airbus Modelleri
            aircraftTypes.add(createAircraftType("Airbus A320", "Airbus", 180, 6100, 840));
            aircraftTypes.add(createAircraftType("Airbus A320neo", "Airbus", 186, 6300, 840));
            aircraftTypes.add(createAircraftType("Airbus A321", "Airbus", 220, 5950, 840));
            aircraftTypes.add(createAircraftType("Airbus A321neo", "Airbus", 244, 7400, 840));
            aircraftTypes.add(createAircraftType("Airbus A330-300", "Airbus", 335, 11750, 870));
            aircraftTypes.add(createAircraftType("Airbus A350-900", "Airbus", 325, 15000, 903));
            aircraftTypes.add(createAircraftType("Airbus A380-800", "Airbus", 555, 15200, 903));
            
            // Embraer Modelleri
            aircraftTypes.add(createAircraftType("Embraer E190", "Embraer", 106, 4537, 829));
            aircraftTypes.add(createAircraftType("Embraer E195-E2", "Embraer", 146, 4815, 833));
            
            // Bombardier Modelleri
            aircraftTypes.add(createAircraftType("Bombardier CRJ900", "Bombardier", 90, 2956, 830));
            aircraftTypes.add(createAircraftType("Bombardier Q400", "Bombardier", 78, 2040, 667));
            
            // ATR Modelleri
            aircraftTypes.add(createAircraftType("ATR 72-600", "ATR", 78, 1528, 510));
            aircraftTypes.add(createAircraftType("ATR 42-600", "ATR", 48, 1326, 510));

            for (AircraftType type : aircraftTypes) {
                aircraftTypeRepository.save(type);
            }
            System.out.println("✅ " + aircraftTypes.size() + " Uçak türü eklendi");

            // ========================================
            // ÖRNEK MÜŞTERİ (1 Müşteri - Ahmet Yılmaz)
            // ========================================
            Customer ahmet = createCustomer("ahmet", "ahmet123", "12345678901", "Ahmet Yılmaz", 
                "1990-05-15", "Erkek", "ahmet.yilmaz@example.com", "05321234567");
            customerRepository.save(ahmet);

            System.out.println("✅ 1 Örnek müşteri eklendi (ahmet / ahmet123)");

            // ========================================
            // UÇUŞLAR - BOŞ (Manuel eklenecek)
            // ========================================
            System.out.println("✅ Uçuşlar boş bırakıldı (admin panelinden eklenecek)");

            // ========================================
            // REZERVASYONLAR - BOŞ (Manuel eklenecek)
            // ========================================
            System.out.println("✅ Rezervasyonlar boş bırakıldı (kullanıcılar tarafından oluşturulacak)");

            // ========================================
            // ÖZET
            // ========================================
            System.out.println("\n🎉 TÜM VERİLER BAŞARIYLA YÜKLENDİ!");
            System.out.println("📊 Özet:");
            System.out.println("   - 1 Admin kullanıcı (admin / admin123)");
            System.out.println("   - 81 Şehir (Türkiye'nin tüm illeri)");
            System.out.println("   - " + airports.size() + " Havalimanı");
            System.out.println("   - 4 Havayolu (uçak sayısı: 0)");
            System.out.println("   - " + aircraftTypes.size() + " Uçak türü");
            System.out.println("   - 1 Müşteri (ahmet / ahmet123)");
            System.out.println("   - 0 Uçak (manuel eklenecek)");
            System.out.println("   - 0 Uçuş (manuel eklenecek)");
            System.out.println("   - 0 Rezervasyon");
            System.out.println("\n🚀 Backend hazır!");
            System.out.println("🔑 Admin: admin / admin123");
            System.out.println("👤 Müşteri: ahmet / ahmet123");
        };
    }

    // Helper metodlar
    private City createCity(String city, String country, String timeZone) {
        City cityEntity = new City();
        cityEntity.setCity(city);
        cityEntity.setCountry(country);
        cityEntity.setTimeZone(timeZone);
        return cityEntity;
    }

    private Airport createAirport(String code, String name, City city) {
        Airport airport = new Airport();
        airport.setCode(code);
        airport.setName(name);
        airport.setCity(city);
        return airport;
    }

    private Airline createAirline(String name, String ulke, Integer yillikUcusSayisi, Integer ucakSayisi, String iataCode, String icaoCode) {
        Airline airline = new Airline();
        airline.setName(name);
        airline.setUlke(ulke);
        airline.setYillikUcusSayisi(yillikUcusSayisi);
        airline.setUcakSayisi(ucakSayisi);
        airline.setIataCode(iataCode);
        airline.setIcaoCode(icaoCode);
        return airline;
    }

    private AircraftType createAircraftType(String model, String manufacturer, int capacity, int rangeKm, int cruiseSpeedKmh) {
        AircraftType type = new AircraftType();
        type.setModel(model);
        type.setManufacturer(manufacturer);
        type.setCapacity(capacity);
        type.setRangeKm(rangeKm);
        type.setCruiseSpeedKmh(cruiseSpeedKmh);
        return type;
    }

    private Customer createCustomer(String username, String password, String tcNo, String isimSoyad, 
                                    String dogumTarihi, String cinsiyet, String mail, String telNo) {
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
}

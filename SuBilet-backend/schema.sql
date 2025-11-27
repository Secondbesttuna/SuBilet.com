-- SuBilet-backend Database Schema

-- --- 1. AŞAMA: BAĞIMSIZ TABLOLAR ---

-- 1. Airline (Havayolu)
CREATE TABLE airline (
    airline_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ulke VARCHAR(50),
    ucus_sayisi INT DEFAULT 0,
    ucak_sayisi INT DEFAULT 0,
    iata_code VARCHAR(10) UNIQUE,
    icao_code VARCHAR(10) UNIQUE
);

-- 2. Airport (Havaalanı)
CREATE TABLE airport (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50),
    country VARCHAR(50),
    time_zone VARCHAR(50)
);

-- 3. Customer (Müşteri)
CREATE TABLE customer (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    tc_no VARCHAR(11) UNIQUE NOT NULL,
    isim_soyad VARCHAR(100) NOT NULL,
    dogum_tarihi DATE,
    uyruk VARCHAR(50),
    cinsiyet VARCHAR(10),
    mail VARCHAR(100) UNIQUE,
    tel_no VARCHAR(20)
);

-- --- 2. AŞAMA: BAĞIMLI TABLOLAR ---

-- 4. Aircraft (Uçak) -> Airline'a bağlı
-- DİKKAT: airline_id artık INT ve uyumlu.
CREATE TABLE aircraft (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    airline_id INT NOT NULL,
    model VARCHAR(50),
    tail_number VARCHAR(20) UNIQUE,
    capacity INT,
    uretici VARCHAR(50),
    FOREIGN KEY (airline_id) REFERENCES airline(airline_id)
);

-- 5. Flight (Uçuş)
CREATE TABLE flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    airline_id INT NOT NULL,
    aircraft_id INT,
    origin_airport_id INT NOT NULL,
    destination_airport_id INT NOT NULL,
    kalkis_tarihi DATETIME NOT NULL,
    inis_tarihi DATETIME NOT NULL,
    base_price DECIMAL(10, 2),
    FOREIGN KEY (airline_id) REFERENCES airline(airline_id),
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(aircraft_id),
    FOREIGN KEY (origin_airport_id) REFERENCES airport(airport_id),
    FOREIGN KEY (destination_airport_id) REFERENCES airport(airport_id)
);

-- 6. Reservation (Rezervasyon)
CREATE TABLE reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    pnr VARCHAR(10) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_number VARCHAR(5),
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    FOREIGN KEY (user_id) REFERENCES customer(user_id),
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id)
);

-- 7. Payment (Ödeme)
CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT UNIQUE NOT NULL,
    method VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'TRY',
    amount DECIMAL(10, 2) NOT NULL,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20),
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id)
);
package com.subilet.backend.repository;

import com.subilet.backend.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Integer> {
    Optional<City> findByCity(String city);
    Optional<City> findByCityAndCountry(String city, String country);
}


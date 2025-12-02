package com.subilet.backend.service;

import com.subilet.backend.entity.City;
import com.subilet.backend.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CityService {

    @Autowired
    private CityRepository cityRepository;

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    public Optional<City> getCityById(Integer id) {
        return cityRepository.findById(id);
    }

    public Optional<City> getCityByName(String cityName) {
        return cityRepository.findByCity(cityName);
    }

    public City createCity(City city) {
        return cityRepository.save(city);
    }
}


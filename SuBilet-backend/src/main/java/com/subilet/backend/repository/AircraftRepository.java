package com.subilet.backend.repository;

import com.subilet.backend.entity.Aircraft;
import org.springframework.data.jpa.repository.JpaRepository;

// Bu repository sadece DataInitializer için kullanılıyor
// Aircraft entity'si Flight ile ilişkili olduğu için gerekli
public interface AircraftRepository extends JpaRepository<Aircraft, Integer> {
}


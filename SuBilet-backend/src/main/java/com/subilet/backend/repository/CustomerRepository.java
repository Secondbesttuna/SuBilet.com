package com.subilet.backend.repository;

import com.subilet.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByTcNo(String tcNo);
    Optional<Customer> findByUsername(String username);
    Optional<Customer> findByMail(String mail);
    boolean existsByTcNo(String tcNo);
    boolean existsByUsername(String username);
}
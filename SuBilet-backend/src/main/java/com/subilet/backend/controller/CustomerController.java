package com.subilet.backend.controller;

import com.subilet.backend.dto.ApiResponse;
import com.subilet.backend.entity.Customer;
import com.subilet.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable Integer id) {
        return customerService.getCustomerById(id)
                .map(customer -> ResponseEntity.ok(ApiResponse.success("Müşteri bulundu", customer)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Müşteri bulunamadı")));
    }

    @GetMapping("/tc/{tcNo}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerByTcNo(@PathVariable String tcNo) {
        return customerService.findByTcNo(tcNo)
                .map(customer -> ResponseEntity.ok(ApiResponse.success("Müşteri bulundu", customer)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Bu TC Kimlik No ile müşteri bulunamadı")));
    }

    @PostMapping
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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
        try {
            Customer updated = customerService.updateCustomer(id, customer);
            return ResponseEntity.ok(ApiResponse.success("Müşteri bilgileri başarıyla güncellendi", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Müşteri bulunamadı veya güncellenemedi"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Müşteri başarıyla silindi", null));
    }

    // Kullanıcı girişi (TC No ile)
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Customer>> login(@RequestBody Customer loginRequest) {
        return customerService.findByTcNo(loginRequest.getTcNo())
                .map(customer -> ResponseEntity.ok(ApiResponse.success("Giriş başarılı. Hoş geldiniz, " + customer.getIsimSoyad(), customer)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("TC Kimlik No bulunamadı. Lütfen rezervasyon yaparken kullandığınız TC No'yu giriniz")));
    }
}
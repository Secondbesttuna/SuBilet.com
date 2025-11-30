package com.subilet.backend.service;

import com.subilet.backend.entity.Customer;
import com.subilet.backend.exception.ResourceNotFoundException;
import com.subilet.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }

    public Customer createCustomer(Customer customer) {
        // TC No kontrolü - varsa mevcut müşteriyi döndür
        if (customer.getTcNo() != null && !customer.getTcNo().isEmpty()) {
            Optional<Customer> existing = customerRepository.findByTcNo(customer.getTcNo());
            if (existing.isPresent()) {
                return existing.get(); // Mevcut müşteriyi döndür
            }
        }
        
        // Username ve password kontrolü
        if (customer.getUsername() == null || customer.getUsername().isEmpty()) {
            throw new RuntimeException("Kullanıcı adı zorunludur");
        }
        if (customer.getPassword() == null || customer.getPassword().isEmpty()) {
            throw new RuntimeException("Şifre zorunludur");
        }
        
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Integer id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Müşteri bulunamadı: " + id));

        customer.setIsimSoyad(customerDetails.getIsimSoyad());
        customer.setDogumTarihi(customerDetails.getDogumTarihi());
        customer.setUyruk(customerDetails.getUyruk());
        customer.setCinsiyet(customerDetails.getCinsiyet());
        customer.setMail(customerDetails.getMail());
        customer.setTelNo(customerDetails.getTelNo());

        return customerRepository.save(customer);
    }

    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }

    public Optional<Customer> findByTcNo(String tcNo) {
        return customerRepository.findByTcNo(tcNo);
    }
}


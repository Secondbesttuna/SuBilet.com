package com.subilet.backend.service;

import com.subilet.backend.entity.Customer;
import com.subilet.backend.exception.BadRequestException;
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
        // TC No kontrolü
        if (customerRepository.existsByTcNo(customer.getTcNo())) {
            throw new BadRequestException("Bu TC No ile kayıtlı bir müşteri zaten mevcut!");
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


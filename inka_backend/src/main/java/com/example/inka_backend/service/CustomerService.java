package com.example.inka_backend.service;

import com.example.inka_backend.model.Customer;
import com.example.inka_backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer updateCustomerDetails(Long id, Customer updatedData) {
        return customerRepository.findById(id).map(customer -> {
            customer.setName(updatedData.getName());
            customer.setAddress(updatedData.getAddress());
            return customerRepository.save(customer);
        }).orElseThrow(() -> new RuntimeException("Customer not found with id " + id));
    }
}

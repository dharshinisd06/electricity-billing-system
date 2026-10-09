package com.example.electricitybilling.service;

import com.example.electricitybilling.entity.Customer;
import com.example.electricitybilling.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Add Customer
    public Customer addCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Get Customer by ID
    public Customer getCustomerById(Integer id) {

        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with id: " + id)
                );
    }

    // Above Average Customers
    public List<Customer> getAboveAverageCustomers() {
        return customerRepository.findCustomersAboveAverageConsumption();
    }
}
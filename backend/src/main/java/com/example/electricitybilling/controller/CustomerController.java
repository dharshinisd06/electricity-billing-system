package com.example.electricitybilling.controller;

import com.example.electricitybilling.entity.Customer;
import com.example.electricitybilling.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // POST /api/customers
    @PostMapping
    public ResponseEntity<Customer> addCustomer(
            @RequestBody Customer customer) {

        Customer savedCustomer =
                customerService.addCustomer(customer);

        return ResponseEntity.ok(savedCustomer);
    }

    // GET /api/customers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(
            @PathVariable Integer id) {

        Customer customer =
                customerService.getCustomerById(id);

        return ResponseEntity.ok(customer);
    }

    // GET /api/customers/above-average
    @GetMapping("/above-average")
    public ResponseEntity<List<Customer>> getAboveAverageCustomers() {

        List<Customer> customers =
                customerService.getAboveAverageCustomers();

        return ResponseEntity.ok(customers);
    }
}
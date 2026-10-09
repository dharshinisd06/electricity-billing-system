package com.example.electricitybilling.repository;

import com.example.electricitybilling.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerRepository
        extends JpaRepository<Customer, Integer> {

    @Query("""
        SELECT DISTINCT c
        FROM Customer c
        JOIN Meter m ON m.customer = c
        JOIN Reading r ON r.meter = m
        WHERE r.unitsConsumed > (
            SELECT AVG(r2.unitsConsumed)
            FROM Reading r2
        )
    """)
    List<Customer> findCustomersAboveAverageConsumption();
}
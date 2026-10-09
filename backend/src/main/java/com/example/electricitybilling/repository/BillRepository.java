package com.example.electricitybilling.repository;

import com.example.electricitybilling.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Integer> {

    @Query("""
        SELECT b
        FROM Bill b
        JOIN FETCH b.customer
        JOIN FETCH b.meter
        JOIN FETCH b.reading
    """)
    List<Bill> findAllBillDetails();

    List<Bill> findByCustomerCustomerId(Integer customerId);
}
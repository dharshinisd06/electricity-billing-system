package com.example.electricitybilling.service;

import com.example.electricitybilling.entity.Bill;
import com.example.electricitybilling.repository.BillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    // Get all bills
    public List<Bill> getAllBills() {
        return billRepository.findAllBillDetails();
    }

    // Get bills by customer
    public List<Bill> getBillsByCustomer(Integer customerId) {
        return billRepository.findByCustomerCustomerId(customerId);
    }
}
package com.example.electricitybilling.controller;

import com.example.electricitybilling.entity.Bill;
import com.example.electricitybilling.service.BillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    // GET /api/bills
    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {

        List<Bill> bills =
                billService.getAllBills();

        return ResponseEntity.ok(bills);
    }

    // GET /api/bills/customer/{customerId}
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Bill>> getBillsByCustomer(
            @PathVariable Integer customerId) {

        List<Bill> bills =
                billService.getBillsByCustomer(customerId);

        return ResponseEntity.ok(bills);
    }
}
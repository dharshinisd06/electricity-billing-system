package com.example.electricitybilling.controller;

import com.example.electricitybilling.entity.Reading;
import com.example.electricitybilling.service.ReadingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "http://localhost:5173")
public class ReadingController {

    private final ReadingService readingService;

    public ReadingController(ReadingService readingService) {
        this.readingService = readingService;
    }

    // POST /api/readings/{meterId}
    @PostMapping("/{meterId}")
    public ResponseEntity<Reading> addReading(
            @PathVariable Integer meterId,
            @RequestBody Reading reading) {

        Reading savedReading =
                readingService.addReading(meterId, reading);

        return ResponseEntity.ok(savedReading);
    }
}
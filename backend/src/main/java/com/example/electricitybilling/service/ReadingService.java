package com.example.electricitybilling.service;

import com.example.electricitybilling.entity.Meter;
import com.example.electricitybilling.entity.Reading;
import com.example.electricitybilling.repository.MeterRepository;
import com.example.electricitybilling.repository.ReadingRepository;
import org.springframework.stereotype.Service;

@Service
public class ReadingService {

    private final ReadingRepository readingRepository;
    private final MeterRepository meterRepository;

    public ReadingService(
            ReadingRepository readingRepository,
            MeterRepository meterRepository) {

        this.readingRepository = readingRepository;
        this.meterRepository = meterRepository;
    }

    public Reading addReading(Integer meterId, Reading reading) {

        Meter meter = meterRepository.findById(meterId)
                .orElseThrow(() ->
                        new RuntimeException("Meter not found"));

        reading.setMeter(meter);

        return readingRepository.save(reading);
    }
}

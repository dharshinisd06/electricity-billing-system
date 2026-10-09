package com.example.electricitybilling.repository;

import com.example.electricitybilling.entity.Meter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeterRepository
        extends JpaRepository<Meter, Integer> {
}
package com.example.electricitybilling.repository;

import com.example.electricitybilling.entity.Reading;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingRepository
        extends JpaRepository<Reading, Integer> {
}
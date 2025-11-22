package com.dacn.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dacn.backend.model.ChargingStation;

public interface ChargingStationRepo extends JpaRepository<ChargingStation, String> {
    
} 

package com.dacn.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dacn.backend.model.ChargingStation;

@Repository
public interface ChargingStationRepo extends JpaRepository<ChargingStation, String> {
    @Query("SELECT s FROM ChargingStation s WHERE s.name LIKE :keyword OR s.address LIKE :keyword")
    public List<ChargingStation> findByKeyword(String keyword);
} 

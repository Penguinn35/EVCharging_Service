package com.dacn.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dacn.backend.model.ChargingPoint;

@Repository
public interface ChargingPointRepo extends JpaRepository<ChargingPoint, String> {
    @Query("SELECT p FROM ChargingPoint p JOIN p.connectors c WHERE c.type = :cableType")
    public List<ChargingPoint> findByCableType(@Param("cableType") String cableType);
}

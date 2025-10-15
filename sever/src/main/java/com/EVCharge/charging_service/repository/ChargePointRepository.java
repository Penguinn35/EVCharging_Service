package com.EVCharge.charging_service.repository;

import com.EVCharge.charging_service.entity.ChargePoint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChargePointRepository extends JpaRepository<ChargePoint, Long> {
    List<ChargePoint> findByStation_StationId(Long stationId);
}

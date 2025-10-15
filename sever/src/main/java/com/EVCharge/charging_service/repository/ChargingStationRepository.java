package com.EVCharge.charging_service.repository;

import com.EVCharge.charging_service.entity.ChargingStation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChargingStationRepository extends JpaRepository<ChargingStation, Long> {
    List<ChargingStation> findByBusiness_BusinessId(Long businessId);
}

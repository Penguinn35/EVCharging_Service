package com.EVCharge.charging_service.repository;

import com.EVCharge.charging_service.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessRepository extends JpaRepository<Business, Long> {
}

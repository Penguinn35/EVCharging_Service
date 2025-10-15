package com.EVCharge.charging_service.controller;

import com.EVCharge.charging_service.entity.ChargePoint;
import com.EVCharge.charging_service.repository.ChargePointRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/points")
@CrossOrigin(origins = "*")
public class ChargePointController {

    private final ChargePointRepository chargePointRepository;

    public ChargePointController(ChargePointRepository chargePointRepository) {
        this.chargePointRepository = chargePointRepository;
    }

    // ✅ get all charge points
    @GetMapping
    public List<ChargePoint> getAllPoints() {
        return chargePointRepository.findAll();
    }

    // ✅ get all charge points under specific station
    @GetMapping("/station/{stationId}")
    public List<ChargePoint> getPointsByStation(@PathVariable Long stationId) {
        return chargePointRepository.findByStation_StationId(stationId);
    }
}

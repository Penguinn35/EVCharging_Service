package com.EVCharge.charging_service.controller;

import com.EVCharge.charging_service.entity.ChargingStation;
import com.EVCharge.charging_service.repository.ChargingStationRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = "*")
public class ChargingStationController {

    private final ChargingStationRepository stationRepository;

    public ChargingStationController(ChargingStationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    @GetMapping
    public List<ChargingStation> getAllStations() {
        return stationRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargingStation> getStationById(@PathVariable Long id) {
        return stationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.dacn.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.repository.ChargingStationRepo;

@Service
public class StationService {
    @Autowired
    private ChargingStationRepo stationRepo;

    public List<ChargingStation> getAllStations() {
        return stationRepo.findAll();
    }
}

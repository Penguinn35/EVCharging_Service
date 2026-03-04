package com.dacn.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.repository.ChargingStationRepo;
import com.dacn.backend.repository.impl.ChargingStationRepoImpl;

@Service
public class StationService {
    @Autowired
    private ChargingStationRepo stationRepo;
    @Autowired
    private ChargingStationRepoImpl stationRepoImpl;

    public List<ChargingStation> getAllStations() {
        return stationRepo.findAll();
    }

    public List<StationResponseDTO> searchByKeyword(String keyword) {
        // TODO Auto-generated method 
        keyword = "%" + keyword + "%";
        int limit = 5; // to limit the rows returned
        return stationRepoImpl.findByKeyword(keyword, limit);
    }
}

package com.dacn.backend.service;

import com.dacn.backend.dto.CoordinateDTO;
import com.dacn.backend.dto.HitfullResponseDTO;
import com.dacn.backend.dto.UserLocationHistoryDTO;
import com.dacn.backend.repository.ChargingStationRepo;
import com.dacn.backend.repository.UserLocationHistoryRepo;
import com.dacn.backend.repository.UserSuggestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessHotspotService {
    @Autowired
    private UserSuggestionRepo suggestionRepo;
    @Autowired
    private UserLocationHistoryRepo locationHistoryRepo;
    @Autowired
    private ChargingStationRepo stationRepo;

    public List<CoordinateDTO> getSuggestions() {
        return suggestionRepo.getSuggestions();
    }

    public List<UserLocationHistoryDTO> getLocationHistory() {
        return locationHistoryRepo.getLocations();
    }

    public List<HitfullResponseDTO> getHitfullCount(String companyId) {
        return stationRepo.getAllHitfull(companyId);
    }
}

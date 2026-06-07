package com.dacn.backend.service;

import com.dacn.backend.dto.HitfullResponseDTO;
import com.dacn.backend.dto.UserLocationHistoryDTO;
import com.dacn.backend.dto.UserSuggestedStationDTO;
import com.dacn.backend.repository.ChargingStationRepo;
import com.dacn.backend.repository.HitfullStatisticRepo;
import com.dacn.backend.repository.UserLocationHistoryRepo;
import com.dacn.backend.repository.UserSuggestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BusinessHotspotService {
    @Autowired
    private UserSuggestionRepo suggestionRepo;
    @Autowired
    private UserLocationHistoryRepo locationHistoryRepo;
    @Autowired
    private ChargingStationRepo stationRepo;
    @Autowired
    private HitfullStatisticRepo hitfullStatisticRepo;

    public List<UserSuggestedStationDTO> getSuggestions(Double longitude, Double latitude, Double radius,
                                                        LocalDate fromDate, LocalDate toDate) {
        return suggestionRepo.getSuggestions(longitude, latitude, radius, fromDate, toDate);
    }

    public List<UserLocationHistoryDTO> getLocationHistory() {
        return locationHistoryRepo.getLocations();
    }

    public List<HitfullResponseDTO> getHitfullCount(String companyId, Double longitude,
                                                    Double latitude, Double radius,
                                                    LocalDate fromDate, LocalDate toDate) {
//        return stationRepo.getAllHitfull(companyId);
        return hitfullStatisticRepo.getAllHitfull(companyId, longitude, latitude, radius, fromDate, toDate);
    }
}

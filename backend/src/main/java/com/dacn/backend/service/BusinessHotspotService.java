package com.dacn.backend.service;

import com.dacn.backend.dto.*;
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

    public List<CoordinateDTO> getSuggestionsGenerally(LocalDate fromDate, LocalDate toDate) {
        return suggestionRepo.getGeneralSuggestions(fromDate, toDate);
    }

    public List<UserLocationHistoryDTO> getLocationHistory(LocalDate fromDate, LocalDate toDate) {
        return locationHistoryRepo.getLocations(fromDate, toDate);
    }

    public List<HitfullResponseDTO> getHitfullCount(String companyId, Double longitude,
                                                    Double latitude, Double radius,
                                                    LocalDate fromDate, LocalDate toDate) {
//        return stationRepo.getAllHitfull(companyId);
        return hitfullStatisticRepo.getAllHitfull(companyId, longitude, latitude, radius, fromDate, toDate);
    }

    public List<HitfullGeneralDTO> getHitfullGenerally(String companyId, LocalDate fromDate, LocalDate toDate) {
        return hitfullStatisticRepo.getHitfullGeneral(companyId, fromDate, toDate);
    }
}

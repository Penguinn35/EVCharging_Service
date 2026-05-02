package com.dacn.backend.service;

import com.dacn.backend.dto.CoordinateDTO;
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

    public List<CoordinateDTO> getSuggestions() {
        return suggestionRepo.getSuggestions();
    }

    public List<CoordinateDTO> getLocationHistory() {
        return locationHistoryRepo.getLocations();
    }
}

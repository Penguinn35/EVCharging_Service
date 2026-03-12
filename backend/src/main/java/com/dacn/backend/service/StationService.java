package com.dacn.backend.service;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dacn.backend.dto.StationDetailResponseDTO;
import com.dacn.backend.dto.UserStationCategoriesRequestDTO;
import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.type.Coordinate;
import com.dacn.backend.repository.ChargingPointRepo;
import com.dacn.backend.repository.ChargingStationRepo;

@Service
public class StationService {
    @Autowired
    private ChargingStationRepo stationRepo;
    @Autowired
    private ChargingPointRepo chargingPointRepo;

    private String deAccent(String str) {
        String nfdNormalizedString = Normalizer.normalize(str, Normalizer.Form.NFD); 
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfdNormalizedString)
            .replaceAll("")
            .toLowerCase()
            .replaceAll("đ", "d");
    }

    public List<ChargingStation> getAllStations() {
        return stationRepo.findAll();
    }

    public List<StationResponseDTO> searchByKeyword(String keyword) {
        // TODO Auto-generated method 

        keyword = "%" + deAccent(keyword) + "%";
        int limit = 5; // to limit the rows returned
        return stationRepo.findByKeyword(keyword, limit);
    }

    public List<StationResponseDTO> searchByLocation(Coordinate position) {
        // TODO Auto-generated method stub
        return stationRepo.findByLongitudeAndLatitude(position.getLongitude(), position.getLatitude());
    }

    public StationDetailResponseDTO getStationDetail(String id) {
        ChargingStation station = stationRepo.findById(id).orElse(null);
        if (station == null) {
            return null;
        }
        StationDetailResponseDTO response = new StationDetailResponseDTO();
        response.setId(id);
        response.setName(station.getName());
        response.setManufacturer(station.getManufacturer());
        response.setAddress(station.getAddress());
        response.setStatus(station.getStatus());
        response.setPosition(station.getPosition());
        return response;
    }

    public StationResponseDTO getSuggestedStation(UserStationCategoriesRequestDTO categories) {
        // TODO Auto-generated method stub
        return stationRepo.findByCableType(categories.getChargeCableType(), categories.getPosition().getLongitude(), categories.getPosition().getLatitude());
    }
}

package com.dacn.backend.service;

import java.text.Normalizer;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

import com.dacn.backend.dto.RatingRequestDTO;
import com.dacn.backend.dto.RatingResponseDTO;
import com.dacn.backend.dto.search_by_keyword.StationSearchResponseDTO;
import com.dacn.backend.model.Rating;
import com.dacn.backend.repository.EVUserRepo;
import com.dacn.backend.repository.RatingRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dacn.backend.dto.StationDetailResponseDTO;
import com.dacn.backend.dto.UserStationCategoriesRequestDTO;
import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.type.Coordinate;
import com.dacn.backend.repository.ChargingStationRepo;

@Service
public class StationService {
    @Autowired
    private ChargingStationRepo stationRepo;
    @Autowired
    private RatingRepo ratingRepo;
    @Autowired
    private EVUserRepo eVUserRepo;
//    @Autowired
//    private ChargingPointRepo chargingPointRepo;

    private String deAccent(String str) {
        String nfdNormalizedString = Normalizer.normalize(str, Normalizer.Form.NFD); 
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfdNormalizedString)
            .replaceAll("")
            .toLowerCase()
            .replaceAll("đ", "d");
    }

//    public List<ChargingStation> getAllStations() {
//        return stationRepo.findAll();
//    }

    public List<StationSearchResponseDTO> searchByKeyword(String keyword) {
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
        response.setDistrict(station.getDistrict());
        response.setStatus(station.getStatus());
        response.setPosition(station.getPosition());
        return response;
    }

    public StationResponseDTO getSuggestedStation(UserStationCategoriesRequestDTO categories) {
        // TODO Auto-generated method stub
        return stationRepo.findByCableType(categories.getChargeCableType(), categories.getPosition().getLongitude(), categories.getPosition().getLatitude());
    }

    @Transactional
    public RatingResponseDTO rateStation(RatingRequestDTO rating) throws RuntimeException {
        Rating newRating = new Rating();
        newRating.setDatePosted(new Date());
        newRating.setPoint(rating.getPoint());
        newRating.setComment(rating.getComment());
        newRating.setStation(stationRepo.getReferenceById(rating.getStationId()));
        newRating.setUser(eVUserRepo.getReferenceById(rating.getUserId()));

        Rating savedRating = ratingRepo.save(newRating);
        return new RatingResponseDTO(savedRating.getId());
    }
}

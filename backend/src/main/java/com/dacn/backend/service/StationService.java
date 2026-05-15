package com.dacn.backend.service;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.dacn.backend.dto.*;
import com.dacn.backend.dto.search_by_keyword.StationSearchResponseDTO;
import com.dacn.backend.model.*;
import com.dacn.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;
import com.dacn.backend.model.type.Coordinate;

@Service
public class StationService {
    @Autowired
    private ChargingStationRepo stationRepo;
    @Autowired
    private RatingRepo ratingRepo;
    @Autowired
    private EVUserRepo eVUserRepo;
    @Autowired
    private UserSavesStationRepo userSavesStationRepo;
    @Autowired
    private ChargingPointRepo chargingPointRepo;
    @Autowired
    private CPORepo cpoRepo;
    @Autowired
    private StationStatisticRepo stationStatisticRepo;
    @Autowired
    private UserLocationHistoryRepo userLocationHistoryRepo;
//    @Autowired
//    private ChargingPointRepo chargingPointRepo;

    public static String deAccent(String str) {
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

    public List<StationByLocationResponseDTO> searchByLocation(Coordinate position) {
        // TODO Auto-generated method stub
        UserLocationHistory userLocation = new UserLocationHistory();
        userLocation.setLocation(position);
        userLocation.setTimestamp(LocalDateTime.now());
        userLocation.setUser(null);
        userLocationHistoryRepo.save(userLocation);

        return stationRepo.findByLongitudeAndLatitude(position.getLongitude(), position.getLatitude());
    }

    public StationDetailResponseDTO getStationDetail(String id) {
        ChargingStation station = stationRepo.findById(id).orElse(null);
        if (station == null) {
            return null;
        }

        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        int updatedRows = stationStatisticRepo.incrementViewCount(today, id);

        if (updatedRows == 0) {
            StationStatistic newStat = new StationStatistic();
            newStat.setDate(today);
            newStat.setStation(station);
            newStat.setViewDetailCount(1L);
            stationStatisticRepo.save(newStat);
        }

        StationDetailResponseDTO response = new StationDetailResponseDTO();
        response.setId(id);
        response.setName(station.getName());
        response.setManufacturer(station.getCpo().getCompanyName());
        response.setAddress(station.getAddress());
        response.setDistrict(station.getDistrict());
        response.setStatus(station.getStatus());
        response.setPosition(station.getPosition());
//        response.setImageUrl(station.getImageUrl());

        List<StationImage> returnedImages = station.getImages();
        List<StationImageDTO> stationImages = new ArrayList<>(returnedImages.size());

        for (StationImage returnedImage : returnedImages) {
            StationImageDTO image = new StationImageDTO();
            image.setUrl(returnedImage.getUrl());
            image.setKey(returnedImage.getKey());

            stationImages.add(image);
        }
        response.setImages(stationImages);


        List<ConnectorDTO> returnedConnectors = chargingPointRepo.getConnectorsFromChargingPointWithStationId(id);
        response.setConnectors(returnedConnectors);

        return response;
    }

    public StationResponseDTO getSuggestedStation(UserStationCategoriesRequestDTO categories, String userId) {
        // save user's location in user history table

        StationResponseDTO response = stationRepo.findByCableType(categories.getChargeCableType(), categories.getPosition().getLongitude(), categories.getPosition().getLatitude());

        UserLocationHistory userLocation = new UserLocationHistory();
        userLocation.setLocation(categories.getPosition());
        userLocation.setTimestamp(LocalDateTime.now());
        userLocation.setUser(eVUserRepo.getReferenceById(userId));
        userLocationHistoryRepo.save(userLocation);

        return response;
    }

    @Transactional
    public RatingResponseDTO rateStation(String userId, RatingRequestDTO rating) throws RuntimeException {
        Rating newRating = ratingRepo.findByUserAndStation(
                eVUserRepo.getReferenceById(userId), stationRepo.getReferenceById(rating.getStationId())
        ).orElse(null);
        if (newRating == null) {
            newRating = new Rating();
        }
        newRating.setDatePosted(LocalDateTime.now());
        newRating.setPoint(rating.getPoint());
        newRating.setComment(rating.getComment());
        newRating.setStation(stationRepo.getReferenceById(rating.getStationId()));
        newRating.setUser(eVUserRepo.getReferenceById(userId));

        Rating savedRating = ratingRepo.save(newRating);
        return new RatingResponseDTO(savedRating.getId(), savedRating.getComment(), savedRating.getPoint(), savedRating.getDatePosted());
    }

    public Page<RatingResponseDTO> getRatingListOfStation(String stationId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return ratingRepo.findByStation(stationId, pageable);
    }

    public List<RatingStatisticDTO> getRatingStatistic(String stationId) {
        return ratingRepo.getStatistic(stationId);
    }

    @Transactional
    public void saveStation(String userId, String stationId) {
        // TO DO: implement saving station functionality for user
//        if (!eVUserRepo.existsById(userId)) {
//            throw new NoSuchElementException("There is no userId " + userId);
//        }
//        if (!stationRepo.existsById(stationId)) {
//            throw new NoSuchElementException("There is no stationId " + stationId);
//        }
        stationRepo.incrementSaveCount(stationId);
        userSavesStationRepo.saveStationForUser(userId, stationId);
    }

    @Transactional
    public void deleteSaveStation(String userId, String stationId) {
        userSavesStationRepo.deleteUserSavesStationByStationIdAndUserId(userId, stationId);
    }

    public String routingToStation(Coordinate userPosition, String stationId) {
        CoordinateDTO stationPosition = stationRepo.findPositionOfStation(stationId);
//        Long startNode = stationRepo.findNearestNode(userPosition.getLongitude(), userPosition.getLatitude());
//        Long endNode = stationRepo.findNearestNode(stationPosition.getLongitude(), stationPosition.getLatitude());

        return stationRepo.findOptimalRouteGeoJSON(userPosition.getLongitude(), userPosition.getLatitude(),
                stationPosition.getLongitude(), stationPosition.getLatitude());
    }

    public List<LogoResponseDTO> getLogosByNames(List<String> manufacturerNames) {
        return cpoRepo.findByCompanyName(manufacturerNames);
    }

    public List<LogoResponseDTO> getAllLogos() {
        return cpoRepo.findAllLogos();
    }

    public boolean updateChargingPointStatus(String pointId, int status) {
        ChargingPoint chargingPoint = chargingPointRepo.findById(pointId).orElse(null);
        if (chargingPoint == null) {
            return false;
        }
        chargingPoint.setStatus(status);
        chargingPointRepo.save(chargingPoint);
        return true;
    }

    public boolean updateCurrentVehicleCount(String stationId, Long vehicleCount) {
        ChargingStation station = stationRepo.findById(stationId).orElse(null);
        if (station == null) {
            return false;
        }
        station.setCurrentVehicleCount(vehicleCount);
        stationRepo.save(station);
        return true;
    }
}

package com.dacn.backend.service;

import com.dacn.backend.constants.StationStatus;
import com.dacn.backend.dto.*;
import com.dacn.backend.model.ChargingPoint;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.Connector;
import com.dacn.backend.model.StationImage;
import com.dacn.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class BusinessService {

    @Autowired
    private ChargingStationRepo stationRepo;
//    @Autowired
//    private ChargingPointRepo chargingPointRepo;
//    @Autowired
//    private ConnectorRepo connectorRepo;
    @Autowired
    private CPORepo cpoRepo;
    @Autowired
    private StationImageRepo imageRepo;
    @Autowired
    private S3Client s3Client;

    @Value("${aws.bucket.name}")
    private String bucketName;

    // --- Public API Methods ---

    public Page<StationBusinessSearchDTO> findStationByKeyword(String keyword, String district, int page, int size, String manufacturerId) {
        Pageable pageable = PageRequest.of(page, size);
        String formattedKeyword = "%" + StationService.deAccent(keyword) + "%";
        return stationRepo.findBusinessStation(formattedKeyword, district, manufacturerId, pageable);
    }

    @Transactional
    public boolean addNewStation(StationCreationDTO stationDto, List<MultipartFile> imageFiles, String companyId) throws IOException {
        // 1. Validate all images first
        for (MultipartFile image : imageFiles) {
            if (isValidImageFormat(image)) return false;
        }

        // 2. Create Station Entity
        ChargingStation newStation = new ChargingStation();
        newStation.setId(stationDto.getId());
        newStation.setName(stationDto.getName());
        newStation.setPosition(stationDto.getPosition());
        newStation.setAddress(stationDto.getAddress());
        newStation.setDistrict(stationDto.getDistrict());
        newStation.setCpo(cpoRepo.getReferenceById(companyId));

        // 3. Process Images
        List<StationImage> newImages = new ArrayList<>();
        for (MultipartFile image : imageFiles) {
            String key = newStation.getId() + "-" + image.getOriginalFilename();
            String url = uploadToS3(image, key);
            newImages.add(buildStationImage(key, url, image.getContentType(), newStation));
        }
        newStation.setImages(newImages);

        // 4. Process Hierarchy (Points & Connectors)
        mapPointsAndConnectors(stationDto, newStation);

        stationRepo.save(newStation);
        return true;
    }

    @Transactional
    public boolean addImageToStation(MultipartFile imageFile, String stationId, String companyId) throws IOException {
        if (isValidImageFormat(imageFile)) return false;

        ChargingStation station = getValidatedStation(stationId, companyId);
        String key = station.getId() + "-" + imageFile.getOriginalFilename();

        if (imageRepo.existsById(key)) {
            throw new RuntimeException("The image already exists");
        }

        String url = uploadToS3(imageFile, key);
        imageRepo.save(buildStationImage(key, url, imageFile.getContentType(), station));
        return true;
    }

    @Transactional
    public boolean changeImage(StationImageRequestDTO imageRequest, String stationId, String companyId) throws IOException {
        MultipartFile imageFile = imageRequest.getImageFile();
        if (isValidImageFormat(imageFile)) return false;

        ChargingStation station = getValidatedStation(stationId, companyId);

        if (!imageRepo.existsById(imageRequest.getKey())) {
            throw new RuntimeException("The image key does not exist");
        }

        deleteFromS3(imageRequest.getKey());
        imageRepo.deleteById(imageRequest.getKey());

        String newKey = station.getId() + "-" + imageFile.getOriginalFilename();
        String url = uploadToS3(imageFile, newKey);
        imageRepo.save(buildStationImage(newKey, url, imageFile.getContentType(), station));
        return true;
    }

    public Page<StationBusinessSearchDTO> findStationOfACompany(String district, String companyId, int page, int size) {
        return stationRepo.findBusinessStationWithoutKeyword(district, companyId, PageRequest.of(page, size));
    }

    // --- Private Helper Methods (The DRY Logic) ---

    private boolean isValidImageFormat(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType == null || (!contentType.contains("png") && !contentType.contains("jpeg") && !contentType.contains("jpg"));
    }

    private String uploadToS3(MultipartFile file, String key) throws IOException {
        s3Client.putObject(PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build(), RequestBody.fromBytes(file.getBytes()));

        return s3Client.utilities().getUrl(GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build()).toExternalForm();
    }

    private void deleteFromS3(String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build());
    }

    private ChargingStation getValidatedStation(String stationId, String companyId) {
        ChargingStation station = stationRepo.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        if (!Objects.equals(station.getCpo().getEnterpriseId(), companyId)) {
            throw new RuntimeException("Access denied: Station belongs to another company");
        }
        return station;
    }

    private StationImage buildStationImage(String key, String url, String type, ChargingStation station) {
        StationImage img = new StationImage();
        img.setKey(key);
        img.setUrl(url);
        img.setType(type);
        img.setStation(station);
        return img;
    }

    private void mapPointsAndConnectors(StationCreationDTO dto, ChargingStation station) {
        if (dto.getChargingPoints() == null) return;

        List<ChargingPoint> points = dto.getChargingPoints().stream().map(pDto -> {
            ChargingPoint point = new ChargingPoint();
            point.setId(pDto.getId());
            point.setStatus(pDto.getStatus());
            point.setChargingStation(station);

            if (pDto.getConnectors() != null) {
                List<Connector> connectors = pDto.getConnectors().stream().map(cDto -> {
                    Connector connector = new Connector();
                    connector.setId(cDto.getId());
                    connector.setType(cDto.getType());
                    connector.setAvailable(cDto.isAvailable());
                    connector.setPrice(cDto.getPrice());
                    connector.setVoltage(cDto.getVoltage());
                    connector.setMaxPower(cDto.getMaxPower());
                    connector.setChargingPoint(point);
                    return connector;
                }).toList();
                point.setConnectors(connectors);
            }
            return point;
        }).toList();

        station.setChargingPoints(points);
    }

    public boolean deleteStation(String key) {
        deleteFromS3(key);
        imageRepo.deleteById(key);
        return true;
    }

    @Transactional
    public Boolean toggleStationStatus(String stationId) {
        ChargingStation station = stationRepo.findById(stationId).orElse(null);
        if (station == null) {
            return Boolean.FALSE;
        }
        int currentStatus = station.getStatus();
        if (currentStatus == StationStatus.UNAVAILABLE.getCode()) {
            station.setStatus(StationStatus.AVAILABLE.getCode());
        } else {
            station.setStatus(StationStatus.UNAVAILABLE.getCode());
        }
        stationRepo.save(station);
        return true;
    }
}

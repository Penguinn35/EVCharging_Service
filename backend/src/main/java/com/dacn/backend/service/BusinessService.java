package com.dacn.backend.service;

import com.dacn.backend.dto.ConnectorCreationDTO;
import com.dacn.backend.dto.PointCreationDTO;
import com.dacn.backend.dto.StationCreationDTO;
import com.dacn.backend.dto.search_by_keyword.StationSearchResponseDTO;
import com.dacn.backend.model.ChargingPoint;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.Connector;
import com.dacn.backend.model.StationImage;
import com.dacn.backend.repository.*;
import jakarta.persistence.EntityManager;
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
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class BusinessService {

    @Autowired
    private ChargingStationRepo stationRepo;
    @Autowired
    private ChargingPointRepo chargingPointRepo;
    @Autowired
    private ConnectorRepo connectorRepo;
    @Autowired
    private CPORepo cpoRepo;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private StationImageRepo imageRepo;

    @Autowired
    private S3Client s3Client;

    @Value("${aws.bucket.name}")
    private String bucketName;

    public Page<StationSearchResponseDTO> findStationByKeyword(String keyword, int page, int size, String manufacturerId) {
        Pageable pageable = PageRequest.of(page, size);
        keyword = "%" + StationService.deAccent(keyword) + "%";

        return stationRepo.findBusinessStation(keyword, manufacturerId, pageable);
    }

    @Transactional
    public boolean addNewStation(StationCreationDTO station, List<MultipartFile> imageFiles, String companyId) throws IOException {
        ChargingStation newStation = new ChargingStation();
        newStation.setId(station.getId());
        newStation.setName(station.getName());
        newStation.setPosition(station.getPosition());
        newStation.setAddress(station.getAddress());
        newStation.setDistrict(station.getDistrict());
        newStation.setTotalPoints(0L);
        newStation.setCpo(cpoRepo.getReferenceById(companyId));

//        if (!(imageFile.getContentType().contains("png") || imageFile.getContentType().contains("jpeg")
//                || imageFile.getContentType().contains("jpg"))) {
//            return false;
//        }
////        System.out.println(imageFile.getContentType());
//        s3Client.putObject(PutObjectRequest.builder()
//                .bucket(bucketName)
//                .key(imageFile.getOriginalFilename())
//                .build(), RequestBody.fromBytes(imageFile.getBytes()));
//
//        GetUrlRequest imageUrlRequest = GetUrlRequest.builder()
//                .bucket(bucketName)
//                .key(imageFile.getOriginalFilename())
//                .build();
//        String imageUrl = s3Client.utilities().getUrl(imageUrlRequest).toExternalForm();
//
//        newStation.setImageUrl(imageUrl);

        for (MultipartFile image : imageFiles) {
            if (!(image.getContentType().contains("png") || image.getContentType().contains("jpeg")
                || image.getContentType().contains("jpg"))) {
                return false;
            }
        }

        List<StationImage> newImages = new ArrayList<>(imageFiles.size());

        for (MultipartFile image : imageFiles) {
            s3Client.putObject(PutObjectRequest.builder()
                .bucket(bucketName)
                .key(image.getOriginalFilename())
                .build(), RequestBody.fromBytes(image.getBytes()));
            GetUrlRequest imageUrlRequest = GetUrlRequest.builder()
                    .bucket(bucketName)
                    .key(image.getOriginalFilename())
                    .build();
            String imageUrl = s3Client.utilities().getUrl(imageUrlRequest).toExternalForm();

            StationImage newImage = new StationImage();
            newImage.setKey(image.getOriginalFilename());
            newImage.setUrl(imageUrl);
            newImage.setType(image.getContentType());
            newImage.setStation(newStation);

            newImages.add(newImage);
        }

        newStation.setImages(newImages);

        // create new charging point
        List<PointCreationDTO> points = station.getChargingPoints();
        if (points != null) {
            List<ChargingPoint> newPoints = new ArrayList<>(points.size());
            for (PointCreationDTO point : points) {
                ChargingPoint newChargingPoint = new ChargingPoint();
                newChargingPoint.setId(point.getId());
                newChargingPoint.setStatus(point.getStatus());
                newChargingPoint.setChargingStation(newStation);

                // create connectors

                List<ConnectorCreationDTO> connectors = point.getConnectors();
                if (connectors != null) {
                    List<Connector> newConnectors = new ArrayList<>(connectors.size());
                    for (ConnectorCreationDTO connector : connectors) {
                        Connector newConnector = new Connector();
                        newConnector.setId(connector.getId());
                        newConnector.setType(connector.getType());
                        newConnector.setAvailable(connector.isAvailable());
                        newConnector.setPrice(connector.getPrice());
                        newConnector.setVoltage(connector.getVoltage());
                        newConnector.setMaxPower(connector.getMaxPower());
                        newConnector.setChargingPoint(newChargingPoint);
//                        newConnector = connectorRepo.save(newConnector);

                        newConnectors.add(newConnector);
                    }

                    newChargingPoint.setConnectors(newConnectors);
                }
//                newChargingPoint = chargingPointRepo.save(newChargingPoint);
                newPoints.add(newChargingPoint);
            }
            newStation.setChargingPoints(newPoints);
        }
        entityManager.persist(newStation);
        return true;
    }

    @Transactional
    public boolean addImageToStation(MultipartFile imageFile, String stationId) throws IOException {
//        List<String> allowFileTypes = List.of("jpg", "png", "jpeg");
//        if (!allowFileTypes.contains(imageFile.getContentType())) {
//            return false;
//        }
        if (!(imageFile.getContentType().contains("png") || imageFile.getContentType().contains("jpeg")
        || imageFile.getContentType().contains("jpg"))) {
            return false;
        }
//        System.out.println(imageFile.getContentType());
        s3Client.putObject(PutObjectRequest.builder()
                .bucket(bucketName)
                .key(imageFile.getOriginalFilename())
                .build(), RequestBody.fromBytes(imageFile.getBytes()));

        GetUrlRequest imageUrlRequest = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(imageFile.getOriginalFilename())
                .build();
        String imageUrl = s3Client.utilities().getUrl(imageUrlRequest).toExternalForm();
//        stationRepo.updateImageUrl(imageUrl, stationId);

        StationImage newImage = new StationImage();
        newImage.setKey(imageFile.getOriginalFilename());
        newImage.setUrl(imageUrl);
        newImage.setType(imageFile.getContentType());
        newImage.setStation(stationRepo.getReferenceById(stationId));

        imageRepo.save(newImage);
        return true;
    }


}

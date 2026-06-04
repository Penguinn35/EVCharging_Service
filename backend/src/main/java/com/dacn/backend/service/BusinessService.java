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
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

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
    private ChargingPointRepo pointRepo;
    @Autowired
    private ConnectorRepo connectorRepo;
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

//    @Transactional
//    public boolean addNewStation(StationCreationDTO stationDto, List<MultipartFile> imageFiles, String companyId) throws IOException {
//        // 1. Validate all images first
//        for (MultipartFile image : imageFiles) {
//            if (isNotValidImageFormat(image)) return false;
//        }
//
//        // 2. Create Station Entity
//        ChargingStation newStation = new ChargingStation();
//        newStation.setId(stationDto.getId());
//        newStation.setName(stationDto.getName());
//        newStation.setPosition(stationDto.getPosition());
//        newStation.setAddress(stationDto.getAddress());
//        newStation.setDistrict(stationDto.getDistrict());
//        newStation.setCpo(cpoRepo.getReferenceById(companyId));
//
//        // 3. Process Images
//        List<StationImage> newImages = new ArrayList<>();
//        for (MultipartFile image : imageFiles) {
//            String key = newStation.getId() + "-" + image.getOriginalFilename();
//            String url = uploadToS3(image, key);
//            newImages.add(buildStationImage(key, url, image.getContentType(), newStation));
//        }
//        newStation.setImages(newImages);
//
//        // 4. Process Hierarchy (Points & Connectors)
//        mapPointsAndConnectors(stationDto, newStation);
//
//        stationRepo.save(newStation);
//        return true;
//    }

    @Transactional
    public boolean saveOrUpdateStation(StationCreationDTO stationDto, List<MultipartFile> imageFiles, String companyId) throws IOException {

        // 1. Fetch trạm sạc hiện có hoặc tạo mới nếu chưa tồn tại
        ChargingStation station = stationRepo.findById(stationDto.getId())
                .orElse(new ChargingStation());
        if (!Objects.equals(station.getCpo().getEnterpriseId(), companyId)) {
            return false;
        }

        // Set ID (cần thiết cho trường hợp Add mới)
        station.setId(stationDto.getId());

        // 2. Cập nhật các trường cơ bản (Bỏ qua null)
        if (stationDto.getName() != null) station.setName(stationDto.getName());
        if (stationDto.getPosition() != null) station.setPosition(stationDto.getPosition());
        if (stationDto.getAddress() != null) station.setAddress(stationDto.getAddress());
        if (stationDto.getDistrict() != null) station.setDistrict(stationDto.getDistrict());
        if (companyId != null) station.setCpo(cpoRepo.getReferenceById(companyId));

        // 3. Xử lý Images (Chỉ xử lý nếu có file gửi lên)
        if (imageFiles != null && !imageFiles.isEmpty()) {
            // Lấy danh sách ảnh cũ (nếu có) để giữ nguyên, sau đó append ảnh mới
            List<StationImage> currentImages = station.getImages();
            if (currentImages == null) {
                currentImages = new ArrayList<>();
            }

            for (MultipartFile image : imageFiles) {
                // Lưu ý: Logic gốc của bạn là `if (isNotValidImageFormat) return false`.
                // Thường thì phải là `if (!isNotValidImageFormat)` mới đúng. Bạn kiểm tra lại nhé.
                if (!isNotValidImageFormat(image)) return false;

                String key = station.getId() + "-" + image.getOriginalFilename();
                String url = uploadToS3(image, key);
                currentImages.add(buildStationImage(key, url, image.getContentType(), station));
            }
            station.setImages(currentImages);
        }

        // 4. Process Hierarchy (Points & Connectors)
        mapPointsAndConnectors(stationDto, station);

        stationRepo.save(station);
        return true;
    }

//    @Transactional
//    public StationUpdateRequestDTO modifyStation(StationUpdateRequestDTO newStation, String companyId) {
//        ChargingStation station = stationRepo.findById(newStation.getId()).orElse(null);
//        if (station == null || !Objects.equals(station.getCpo().getEnterpriseId(), companyId)) {
//            return null;
//        }
//        station.setName(newStation.getName());
//        station.setPosition(newStation.getPosition());
//        station.setAddress(newStation.getAddress());
//        station.setDistrict(newStation.getDistrict());
//        stationRepo.save(station);
//        return newStation;
//    }

    @Transactional
    public PointCreationDTO addOrModifyChargingPoint(PointCreationDTO point, String stationId, String companyId) {
        // 1. Kiểm tra trạm sạc và quyền sở hữu
        ChargingStation station = stationRepo.findById(stationId).orElse(null);
        if (station == null || !Objects.equals(station.getCpo().getEnterpriseId(), companyId)) {
            return null;
        }

        // 2. Lấy ChargingPoint từ DB lên hoặc tạo mới
        ChargingPoint targetPoint;
        boolean isNewPoint = false;
        if (point.getId() != null) {
            targetPoint = pointRepo.findById(point.getId()).orElse(null);
            if (targetPoint == null) {
                targetPoint = new ChargingPoint();
                targetPoint.setId(point.getId());
                isNewPoint = true;
            }
        } else {
            targetPoint = new ChargingPoint();
            isNewPoint = true;
        }

        // Chỉ cập nhật status nếu nó không null, HOẶC nếu đây là bản ghi mới tạo
        if (point.getStatus() != null || isNewPoint) {
            targetPoint.setStatus(point.getStatus());
        }
        targetPoint.setChargingStation(station);

        // 3. Xử lý danh sách Connectors
        if (targetPoint.getConnectors() == null) {
            targetPoint.setConnectors(new ArrayList<>());
        }

        // Tạo Map từ các connector hiện tại trong DB để đối chiếu
        Map<String, Connector> existingConnectors = targetPoint.getConnectors().stream()
                .collect(Collectors.toMap(Connector::getId, c -> c));

        List<Connector> updatedConnectors = new ArrayList<>();

        if (point.getConnectors() != null) {
            for (ConnectorCreationDTO connectorDto : point.getConnectors()) {
                Connector connector;
                boolean isNewConnector = false;

                // Nếu connector đã tồn tại trong DB -> Lấy ra để update
                if (connectorDto.getId() != null && existingConnectors.containsKey(connectorDto.getId())) {
                    connector = existingConnectors.get(connectorDto.getId());
                } else {
                    // Nếu chưa tồn tại -> Tạo mới
                    connector = new Connector();
                    connector.setId(connectorDto.getId());
                    connector.setChargingPoint(targetPoint);
                    isNewConnector = true;
                }

                // Kiểm tra từng trường: Chỉ update nếu giá trị truyền lên khác null HOẶC đây là connector mới tạo hoàn toàn
                if (connectorDto.getType() != null || isNewConnector) {
                    connector.setType(connectorDto.getType());
                }
                if (connectorDto.getPrice() != null || isNewConnector) {
                    connector.setPrice(connectorDto.getPrice());
                }
                if (connectorDto.getVoltage() != null || isNewConnector) {
                    connector.setVoltage(connectorDto.getVoltage());
                }
                if (connectorDto.getMaxPower() != null || isNewConnector) {
                    connector.setMaxPower(connectorDto.getMaxPower());
                }

                // Đối với kiểu boolean nguyên thủy (primitive `boolean`), mặc định nó sẽ là false chứ không null.
                // Nếu trong DTO bạn đổi sang Object `Boolean`, hãy dùng kiểm tra null:
                // if (connectorDto.getAvailable() != null || isNewConnector) { ... }
                connector.setAvailable(connectorDto.isAvailable());

                updatedConnectors.add(connector);
            }
        }

        // Cập nhật lại danh sách connector cho ChargingPoint
        targetPoint.getConnectors().clear();
        targetPoint.getConnectors().addAll(updatedConnectors);

        // 4. Lưu dữ liệu
        pointRepo.save(targetPoint);

        return point;
    }

    @Transactional
    public boolean deleteChargingPoint(String pointId, String companyId) {
        // 1. Tìm ChargingPoint trong database
        ChargingPoint targetPoint = pointRepo.findById(pointId).orElse(null);

        if (targetPoint == null) {
            return false; // Không tìm thấy point để xóa
        }

        // 2. Kiểm tra quyền sở hữu của công ty đối với trạm sạc chứa point này
        ChargingStation station = targetPoint.getChargingStation();
        if (station == null || station.getCpo() == null ||
                !Objects.equals(station.getCpo().getEnterpriseId(), companyId)) {
            return false; // Không có quyền xóa (thuộc về công ty khác) hoặc data lỗi
        }

        // 3. Thực hiện xóa
        // Nhờ có cascade = CascadeType.ALL và orphanRemoval = true ở Entity,
        // các Connector thuộc về Point này cũng sẽ được tự động xóa theo.
        pointRepo.delete(targetPoint);

        return true; // Xóa thành công
    }

    @Transactional
    public boolean deleteConnector(String connectorId, String companyId) {
        Connector deletingConnector = connectorRepo.findById(connectorId).orElse(null);
        if (deletingConnector == null
                || !Objects.equals(deletingConnector.getChargingPoint().getChargingStation().getCpo().getEnterpriseId(), companyId)) {
            return false;
        }
        connectorRepo.delete(deletingConnector);
        return true;
    }

    @Transactional
    public boolean deleteStation(String id, String companyId) {
        ChargingStation station = stationRepo.findById(id).orElse(null);
        if (station == null || !Objects.equals(station.getCpo().getEnterpriseId(), companyId)) {
            return false;
        }
        stationRepo.deleteById(id);
        return true;
    }

    @Transactional
    public boolean addImageToStation(MultipartFile imageFile, String stationId, String companyId) throws IOException {
        if (isNotValidImageFormat(imageFile)) return false;

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
        if (isNotValidImageFormat(imageFile)) return false;

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

    private boolean isNotValidImageFormat(MultipartFile file) {
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

package com.dacn.backend.service;

import com.dacn.backend.constants.ConnectorStatus;
import com.dacn.backend.dto.response_from_externals.ChargingPointDto;
import com.dacn.backend.dto.response_from_externals.ConnectorDto;
import com.dacn.backend.dto.response_from_externals.StationDto;
import com.dacn.backend.model.CPO;
import com.dacn.backend.model.ChargingPoint;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.Connector;
import com.dacn.backend.model.type.Coordinate;
import com.dacn.backend.repository.ChargingStationRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CpoSyncService {

    // Nhờ CascadeType.ALL, bạn chỉ cần duy nhất Repository của Station
    private final ChargingStationRepo stationRepository;

    @Transactional
    public void syncStationsFromCPO(List<StationDto> stationDtos, String companyId) {
        List<ChargingStation> stationsToSave = new ArrayList<>();

        for (StationDto stationDto : stationDtos) {
            ChargingStation station = new ChargingStation();
            station.setId(stationDto.id());
            station.setName(stationDto.name());
            station.setAddress(stationDto.address());
            station.setDistrict(stationDto.district());
            station.setStatus(stationDto.status());

            // 1. Xử lý Coordinate (Tọa độ)
            if (stationDto.position() != null) {
                Coordinate position = new Coordinate();
                position.setLatitude(stationDto.position().latitude());
                position.setLongitude(stationDto.position().longitude());
                station.setPosition(position);
            }

            // 2. Xử lý CPO (Khóa ngoại manufacturer_id)
            // Khởi tạo 1 object CPO rỗng chỉ chứa ID để JPA map khóa ngoại mà không cần query DB
            CPO cpo = new CPO();
            cpo.setEnterpriseId(companyId);
            station.setCpo(cpo);

            // Khởi tạo các giá trị đếm mặc định
            station.setNumberOfSaves(0L);
            station.setHitFullCount(0L);

            long totalCapacity = 0;
            long totalAvailableConnectors = 0;
            long currentVehicleCount = 0;

            List<ChargingPoint> chargingPoints = new ArrayList<>();

            // 3. Bóc tách dữ liệu Charging Points
            if (stationDto.chargingPoints() != null) {
                for (ChargingPointDto pointDto : stationDto.chargingPoints()) {
                    ChargingPoint point = new ChargingPoint();
                    point.setId(pointDto.id());
                    point.setStatus(pointDto.status());

                    // Rất quan trọng: Set quan hệ ngược lại cho JPA biết để map khóa ngoại
                    point.setChargingStation(station);

                    int numberOfConnectors = 0;
                    int numberOfAvailable = 0;
                    List<Connector> connectors = new ArrayList<>();

                    // 4. Bóc tách dữ liệu Connectors
                    if (pointDto.connectors() != null) {
                        numberOfConnectors = pointDto.connectors().size();

                        for (ConnectorDto connDto : pointDto.connectors()) {
                            Connector connector = new Connector();
                            connector.setId(connDto.id());
                            connector.setType(connDto.type());
                            connector.setPrice(connDto.price() != null ? connDto.price().doubleValue() : 0.0);
                            connector.setVoltage(connDto.voltage() != null ? connDto.voltage().doubleValue() : 0.0);
                            connector.setMaxPower(connDto.maxPower() != null ? connDto.maxPower().doubleValue() : 0.0);

                            boolean isAvailable = Boolean.TRUE.equals(connDto.isAvailable());
                            connector.setAvailable(isAvailable);

                            // Xử lý status theo enum & đếm số xe đang sạc
                            connector.setStatus(ConnectorStatus.AVAILABLE);

                            // Set quan hệ ngược lại
                            connector.setChargingPoint(point);
                            connectors.add(connector);
                        }
                    }

                    point.setNumberOfConnectors(numberOfConnectors);
                    point.setNumberOfAvailableConnectors(numberOfAvailable);
                    point.setConnectors(connectors); // Add list connectors vào point

                    totalCapacity += numberOfConnectors;
                    totalAvailableConnectors += numberOfAvailable;

                    chargingPoints.add(point);
                }
            }

            station.setChargingPoints(chargingPoints); // Add list points vào station
            station.setCapacity(totalCapacity);
            station.setAvailableConnectorsCount(totalAvailableConnectors);

            // 5. Tận dụng hàm custom của bạn để update xe đang sạc + thay đổi status của Station nếu bị Full
            station.updateVehicleCount(currentVehicleCount);

            stationsToSave.add(station);
        }

        // 6. Lưu toàn bộ (Cascade sẽ tự động insert Point và Connector)
        stationRepository.saveAll(stationsToSave);
    }
}
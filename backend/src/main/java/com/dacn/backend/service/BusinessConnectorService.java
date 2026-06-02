package com.dacn.backend.service;

import com.dacn.backend.constants.StationStatus;
import com.dacn.backend.dto.command.ConnectorCreatePayload;
import com.dacn.backend.dto.command.ConnectorDeletePayload;
import com.dacn.backend.dto.command.ConnectorUpdatePayload;
import com.dacn.backend.exception.InvalidStationCommandException;
import com.dacn.backend.model.ChargingPoint;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.Connector;
import com.dacn.backend.repository.ChargingPointRepo;
import com.dacn.backend.repository.ChargingStationRepo;
import com.dacn.backend.repository.ConnectorRepo;
import com.dacn.backend.util.ConnectorTypeMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class BusinessConnectorService {

    private static final String DEFAULT_POINT_SUFFIX = "-cp-1";

    @Autowired
    private ConnectorRepo connectorRepo;
    @Autowired
    private ChargingPointRepo chargingPointRepo;
    @Autowired
    private ChargingStationRepo stationRepo;

    @Transactional
    public boolean createConnector(ConnectorCreatePayload payload, String companyId) {
        validateConnectorId(payload.getId());

        ChargingPoint chargingPoint = resolveChargingPoint(payload, companyId);
        if (chargingPoint == null) {
            return false;
        }
        if (connectorRepo.existsById(payload.getId())) {
            throw new InvalidStationCommandException("Connector id already exists: " + payload.getId());
        }
        if (payload.getType() == null || payload.getType().isBlank()) {
            throw new InvalidStationCommandException("Connector type is required");
        }

        Connector connector = new Connector();
        connector.setId(payload.getId());
        connector.setType(ConnectorTypeMapper.toCode(payload.getType()));
        connector.setMaxPower(payload.getPowerKw());
        connector.setPrice(payload.getPrice());
        connector.setVoltage(payload.getVoltage());
        connector.setAvailable(payload.getIsAvailable() == null || payload.getIsAvailable());
        connector.setChargingPoint(chargingPoint);

        connectorRepo.save(connector);
        return true;
    }

    @Transactional
    public boolean updateConnector(ConnectorUpdatePayload payload, String companyId) {
        validateConnectorId(payload.getId());

        Connector connector = connectorRepo.findById(payload.getId()).orElse(null);
        if (connector == null || !ownsConnector(connector, companyId)) {
            return false;
        }

        if (payload.getType() != null && !payload.getType().isBlank()) {
            connector.setType(ConnectorTypeMapper.toCode(payload.getType()));
        }
        if (payload.getPowerKw() != null) {
            connector.setMaxPower(payload.getPowerKw());
        }
        if (payload.getPrice() != null) {
            connector.setPrice(payload.getPrice());
        }
        if (payload.getVoltage() != null) {
            connector.setVoltage(payload.getVoltage());
        }
        if (payload.getIsAvailable() != null) {
            connector.setAvailable(payload.getIsAvailable());
        }

        connectorRepo.save(connector);
        return true;
    }

    @Transactional
    public boolean deleteConnector(ConnectorDeletePayload payload, String companyId) {
        validateConnectorId(payload.getId());

        Connector connector = connectorRepo.findById(payload.getId()).orElse(null);
        if (connector == null || !ownsConnector(connector, companyId)) {
            return false;
        }

        connectorRepo.deleteById(payload.getId());
        return true;
    }

    private ChargingPoint resolveChargingPoint(ConnectorCreatePayload payload, String companyId) {
        if (payload.getChargingPointId() != null && !payload.getChargingPointId().isBlank()) {
            ChargingPoint point = chargingPointRepo.findById(payload.getChargingPointId()).orElse(null);
            if (point == null || !ownsChargingPoint(point, companyId)) {
                return null;
            }
            return point;
        }

        if (payload.getStationExternalId() == null || payload.getStationExternalId().isBlank()) {
            throw new InvalidStationCommandException(
                    "chargingPointId or stationExternalId is required for CONNECTOR_CREATE"
            );
        }

        ChargingStation station = stationRepo.findById(payload.getStationExternalId()).orElse(null);
        if (!ownsStation(station, companyId)) {
            return null;
        }

        String defaultPointId = payload.getStationExternalId() + DEFAULT_POINT_SUFFIX;
        return chargingPointRepo.findById(defaultPointId)
                .orElseGet(() -> createDefaultChargingPoint(station, defaultPointId));
    }

    private ChargingPoint createDefaultChargingPoint(ChargingStation station, String pointId) {
        ChargingPoint point = new ChargingPoint();
        point.setId(pointId);
        point.setStatus(StationStatus.AVAILABLE.getCode());
        point.setChargingStation(station);
        return chargingPointRepo.save(point);
    }

    private boolean ownsConnector(Connector connector, String companyId) {
        ChargingPoint point = connector.getChargingPoint();
        return ownsChargingPoint(point, companyId);
    }

    private boolean ownsChargingPoint(ChargingPoint point, String companyId) {
        if (point == null || point.getChargingStation() == null) {
            return false;
        }
        ChargingStation station = stationRepo.findById(point.getChargingStation().getId()).orElse(null);
        return ownsStation(station, companyId);
    }

    private boolean ownsStation(ChargingStation station, String companyId) {
        return station != null
                && station.getCpo() != null
                && Objects.equals(station.getCpo().getEnterpriseId(), companyId);
    }

    private void validateConnectorId(String id) {
        if (id == null || id.isBlank()) {
            throw new InvalidStationCommandException("Connector id is required");
        }
    }
}

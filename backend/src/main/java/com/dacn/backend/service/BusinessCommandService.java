package com.dacn.backend.service;

import com.dacn.backend.dto.*;
import com.dacn.backend.dto.command.*;
import com.dacn.backend.exception.InvalidStationCommandException;
import com.dacn.backend.model.type.Coordinate;
import com.dacn.backend.util.ConnectorTypeMapper;
import com.dacn.backend.util.StationStatusMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class BusinessCommandService {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private BusinessService businessService;
    @Autowired
    private BusinessConnectorService businessConnectorService;

    public BusinessCommandResponseDTO execute(BusinessCommandRequest request, String companyId) throws IOException {
        if (request.getEventType() == null) {
            throw new InvalidStationCommandException("eventType is required");
        }
        if (request.getPayload() == null || request.getPayload().isNull()) {
            throw new InvalidStationCommandException("payload is required");
        }

        BusinessCommandResponseDTO response = new BusinessCommandResponseDTO();
        response.setEventType(request.getEventType());

        boolean success = switch (request.getEventType()) {
            case STATION_CREATED -> handleStationCreated(request.getPayload(), companyId);
            case STATION_UPDATED -> handleStationUpdated(request.getPayload(), companyId);
            case STATION_DELETED -> handleStationDeleted(request.getPayload(), companyId);
            case CONNECTOR_CREATE -> handleConnectorCreate(request.getPayload(), companyId);
            case CONNECTOR_UPDATED -> handleConnectorUpdate(request.getPayload(), companyId);
            case CONNECTOR_DELETE -> handleConnectorDelete(request.getPayload(), companyId);
        };

        response.setSuccess(success);
        response.setResult(request.getPayload());
        return response;
    }

    private boolean handleStationCreated(JsonNode payloadNode, String companyId) throws IOException {
        StationCreatedPayload payload = treeToValue(payloadNode, StationCreatedPayload.class);
        validateStationCreated(payload);

        StationCreationDTO stationDto = toStationCreationDto(payload);
        return businessService.addNewStation(stationDto, Collections.emptyList(), companyId);
    }

    private boolean handleStationUpdated(JsonNode payloadNode, String companyId) {
        StationUpdatedPayload payload = treeToValue(payloadNode, StationUpdatedPayload.class);
        if (payload.getExternalId() == null || payload.getExternalId().isBlank()) {
            throw new InvalidStationCommandException("payload.externalId is required for STATION_UPDATED");
        }
        return businessService.updateStationPartial(payload, companyId);
    }

    private boolean handleStationDeleted(JsonNode payloadNode, String companyId) {
        StationDeletedPayload payload = treeToValue(payloadNode, StationDeletedPayload.class);
        if (payload.getExternalId() == null || payload.getExternalId().isBlank()) {
            throw new InvalidStationCommandException("payload.externalId is required for STATION_DELETED");
        }
        return businessService.deleteStation(payload.getExternalId(), companyId);
    }

    private boolean handleConnectorCreate(JsonNode payloadNode, String companyId) {
        ConnectorCreatePayload payload = treeToValue(payloadNode, ConnectorCreatePayload.class);
        return businessConnectorService.createConnector(payload, companyId);
    }

    private boolean handleConnectorUpdate(JsonNode payloadNode, String companyId) {
        ConnectorUpdatePayload payload = treeToValue(payloadNode, ConnectorUpdatePayload.class);
        return businessConnectorService.updateConnector(payload, companyId);
    }

    private boolean handleConnectorDelete(JsonNode payloadNode, String companyId) {
        ConnectorDeletePayload payload = treeToValue(payloadNode, ConnectorDeletePayload.class);
        return businessConnectorService.deleteConnector(payload, companyId);
    }

    private void validateStationCreated(StationCreatedPayload payload) {
        if (payload.getExternalId() == null || payload.getExternalId().isBlank()) {
            throw new InvalidStationCommandException("payload.externalId is required for STATION_CREATED");
        }
        if (payload.getName() == null || payload.getName().isBlank()) {
            throw new InvalidStationCommandException("payload.name is required for STATION_CREATED");
        }
        if (payload.getLatitude() == null || payload.getLongitude() == null) {
            throw new InvalidStationCommandException("payload.latitude and payload.longitude are required for STATION_CREATED");
        }
    }

    private StationCreationDTO toStationCreationDto(StationCreatedPayload payload) {
        StationCreationDTO dto = new StationCreationDTO();
        dto.setId(payload.getExternalId());
        dto.setName(payload.getName());
        dto.setAddress(payload.getAddress() != null ? payload.getAddress() : "");
        dto.setDistrict(payload.getDistrict() != null ? payload.getDistrict() : "");

        Coordinate position = new Coordinate();
        position.setLatitude(payload.getLatitude());
        position.setLongitude(payload.getLongitude());
        dto.setPosition(position);

        dto.setStatus(StationStatusMapper.toCode(payload.getStatus()));

        if (payload.getConnectors() != null && !payload.getConnectors().isEmpty()) {
            PointCreationDTO point = new PointCreationDTO();
            point.setId(payload.getExternalId() + "-cp-1");
            point.setStatus(dto.getStatus());

            List<ConnectorCreationDTO> connectors = new ArrayList<>();
            for (ConnectorPayloadItem item : payload.getConnectors()) {
                if (item.getId() == null || item.getId().isBlank()) {
                    throw new InvalidStationCommandException("Each connector must have an id");
                }
                ConnectorCreationDTO connectorDto = new ConnectorCreationDTO();
                connectorDto.setId(item.getId());
                connectorDto.setType(ConnectorTypeMapper.toCode(item.getType()));
                connectorDto.setMaxPower(item.getPowerKw());
                connectorDto.setPrice(item.getPrice());
                connectorDto.setVoltage(item.getVoltage());
                connectorDto.setAvailable(item.getIsAvailable() == null || item.getIsAvailable());
                connectors.add(connectorDto);
            }
            point.setConnectors(connectors);
            dto.setChargingPoints(List.of(point));
        }

        return dto;
    }

    private <T> T treeToValue(JsonNode node, Class<T> clazz) {
        try {
            return objectMapper.treeToValue(node, clazz);
        } catch (Exception e) {
            throw new InvalidStationCommandException("Invalid payload for event: " + e.getMessage());
        }
    }
}

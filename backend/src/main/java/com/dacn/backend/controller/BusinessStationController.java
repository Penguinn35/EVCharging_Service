package com.dacn.backend.controller;

import com.dacn.backend.annotation.RequiresVerifiedCpo;
import com.dacn.backend.dto.*;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("api/business")
@Tag(name = "API dành cho doanh nghiệp", description = "Các API cho doanh nghiệp quản lý các trạm sạc của mình")
@RequiresVerifiedCpo
public class BusinessStationController {

    @Autowired
    private BusinessService businessService;

    private enum StationEventType {
        STATION_ADD,
        STATION_CHANGE,
        STATION_DELETE,
        CHARGEPOINT_ADD,
        CHARGEPOINT_DELETE,
        CONNECTOR_ADD,
        CONNECTOR_EDIT,
        CONNECTOR_DELETE
    }

    @lombok.Data
    private static class ConnectorEventPayload {
        private String stationId;
        private String chargePointId;
        private ConnectorCreationDTO connector;
    }

    @lombok.Data
    private static class StationEventRequest {
        private StationEventType eventType;
        private StationEventPayload payload;
    }

    @lombok.Data
    private static class StationEventPayload {
        private StationCreationDTO station;
        private String stationId;
        private PointCreationDTO chargePoint;
        private String chargePointId;
        private ConnectorCreationDTO connector;
        private String connectorId;
    }

    @GetMapping("stations")
    @Operation(
            summary = "API tìm kiếm trạm sạc của doanh nghiệp",
            description = "Trả về các trạm sạc theo paging.\n Note: Nhớ thêm vào extension 'unaccent' cho db"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công"),
            }
    )
    public ResponseEntity<ResponseObject<Page<StationBusinessSearchDTO>>> getBusinessStationByKeywords(
            @RequestParam(required = false) String keyword, @RequestParam(required = false) String district,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Page<StationBusinessSearchDTO> stationData;
        if (keyword == null) {
            stationData = businessService.findStationOfACompany(
                    district,
                    userPrincipal.getCompanyId(), page,
                    size);
        }
        else {
            stationData = businessService.findStationByKeyword(
                    keyword, district, page, size, userPrincipal.getCompanyId()
            );
        }
        return new ResponseEntity<>(
                new ResponseObject<>(
                        HttpStatus.OK,
                        "Returned successfully",
                        stationData,
                        stationData.getTotalElements()
                        ),

                HttpStatus.OK);
    }

    @PutMapping(value = "stations", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequestBody(content = @Content(
            encoding = @Encoding(name = "newStation", contentType = "application/json")
    ))
    @Operation(summary = "API doanh nghiệp thêm hoặc sửa một trạm sạc")
    public ResponseEntity<ResponseObject<Boolean>> addNewStation(@RequestPart("newStation") StationCreationDTO newStation,
                                                                 @RequestPart(value = "imageFiles", required = false) List<MultipartFile> newImage,
                                                                 @AuthenticationPrincipal UserPrincipal principal) throws IOException {
        boolean isStationAdded = businessService.saveOrUpdateStation(newStation, newImage, principal.getCompanyId());
        if (isStationAdded) {
            return new ResponseEntity<>(
                    new ResponseObject<>(
                            HttpStatus.OK,
                            "saved successfully",
                            isStationAdded),
                            HttpStatus.OK);
        }
        return new ResponseEntity<>(
                new ResponseObject<>(HttpStatus.BAD_REQUEST,
                        "Image file type is not allowed",
                        null),
                HttpStatus.BAD_REQUEST
        );
    }

    @PostMapping("stations/events")
    @Operation(summary = "API event chung cho CRUD trạm sạc/điểm sạc/connector")
    public ResponseEntity<ResponseObject<Object>> handleStationEvent(
            @org.springframework.web.bind.annotation.RequestBody StationEventRequest eventRequest,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (eventRequest == null || eventRequest.getEventType() == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Event type is required", null
            ), HttpStatus.BAD_REQUEST);
        }
        if (eventRequest.getPayload() == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Payload is required", null
            ), HttpStatus.BAD_REQUEST);
        }

        String companyId = principal.getCompanyId();
        StationEventType eventType = eventRequest.getEventType();
        StationEventPayload payload = eventRequest.getPayload();

        switch (eventType) {
            case STATION_ADD:
            case STATION_CHANGE:
                return handleStationSaveEvent(payload.getStation(), companyId);
            case STATION_DELETE:
                return handleStationDeleteEvent(payload.getStationId(), companyId);
            case CHARGEPOINT_ADD:
                return handleChargePointSaveEvent(payload.getStationId(), payload.getChargePoint(), companyId);
            case CHARGEPOINT_DELETE:
                return handleChargePointDeleteEvent(payload.getChargePointId(), companyId);
            case CONNECTOR_ADD:
            case CONNECTOR_EDIT:
                return handleConnectorUpsertEvent(buildConnectorEventPayload(payload), companyId);
            case CONNECTOR_DELETE:
                return handleConnectorDeleteEvent(payload.getConnectorId(), companyId);
            default:
                return new ResponseEntity<>(new ResponseObject<>(
                        HttpStatus.BAD_REQUEST, "Unsupported event type", null
                ), HttpStatus.BAD_REQUEST);
        }
    }

//    @PutMapping("stations")
//    @Operation(summary = "API chỉnh sửa thông tin trạm sạc cho doanh nghiệp")
//    public ResponseEntity<ResponseObject<StationUpdateRequestDTO>> modifyStationInfo(
//            @org.springframework.web.bind.annotation.RequestBody StationUpdateRequestDTO modifiedStation,
//            @AuthenticationPrincipal UserPrincipal principal
//    ) {
//        StationUpdateRequestDTO response = businessService.modifyStation(modifiedStation, principal.getCompanyId());
//        if (response == null) {
//            return new ResponseEntity<>(new ResponseObject<>(
//                    HttpStatus.NOT_FOUND, "No such station with that id to update", null
//            ), HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity<>(new ResponseObject<>(
//                HttpStatus.OK, "Updated station successfully", response
//        ), HttpStatus.OK);
//    }

    @DeleteMapping("stations/{id}")
    @Operation(summary = "API xóa trạm sạc bằng id")
    public ResponseEntity<ResponseObject<Boolean>> deleteStation(
            @RequestParam String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (businessService.deleteStation(id, principal.getCompanyId())) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Deleted station successfully", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Something went wrong when deleting station", false
        ), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<ResponseObject<Object>> handleStationSaveEvent(StationCreationDTO station, String companyId) {
        if (station == null || station.getId() == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Station payload or station id is invalid", null
            ), HttpStatus.BAD_REQUEST);
        }
        try {
            boolean isSaved = businessService.saveOrUpdateStation(station, null, companyId);
            if (isSaved) {
                return new ResponseEntity<>(new ResponseObject<>(
                        HttpStatus.OK, "saved successfully", true
                ), HttpStatus.OK);
            }
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Something went wrong when saving station", false
            ), HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Something went wrong when saving station", false
            ), HttpStatus.BAD_REQUEST);
        }
    }

    private ResponseEntity<ResponseObject<Object>> handleStationDeleteEvent(String stationId, String companyId) {
        if (stationId == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Station id is required", null
            ), HttpStatus.BAD_REQUEST);
        }
        if (businessService.deleteStation(stationId, companyId)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Deleted station successfully", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Something went wrong when deleting station", false
        ), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<ResponseObject<Object>> handleChargePointSaveEvent(
            String stationId,
            PointCreationDTO chargePoint,
            String companyId
    ) {
        if (stationId == null || chargePoint == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Station id or charge point payload is invalid", null
            ), HttpStatus.BAD_REQUEST);
        }
        PointCreationDTO savedPoint = businessService.addOrModifyChargingPoint(chargePoint, stationId, companyId);
        if (savedPoint == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Something went wrong when saving charge point", null
            ), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Saved charge point successfully", savedPoint
        ), HttpStatus.OK);
    }

    private ResponseEntity<ResponseObject<Object>> handleChargePointDeleteEvent(String chargePointId, String companyId) {
        if (chargePointId == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Charge point id is required", null
            ), HttpStatus.BAD_REQUEST);
        }
        if (businessService.deleteChargingPoint(chargePointId, companyId)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Deleted charging point successfully", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Something went wrong when deleting charging point", false
        ), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<ResponseObject<Object>> handleConnectorUpsertEvent(
            ConnectorEventPayload connectorEvent,
            String companyId
    ) {
        if (connectorEvent == null
                || connectorEvent.getStationId() == null
                || connectorEvent.getChargePointId() == null
                || connectorEvent.getConnector() == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Connector event payload is invalid", null
            ), HttpStatus.BAD_REQUEST);
        }

        PointCreationDTO pointRequest = new PointCreationDTO();
        pointRequest.setId(connectorEvent.getChargePointId());
        pointRequest.setConnectors(Collections.singletonList(connectorEvent.getConnector()));

        PointCreationDTO savedPoint = businessService.addOrModifyChargingPoint(
                pointRequest,
                connectorEvent.getStationId(),
                companyId
        );

        if (savedPoint == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Something went wrong when saving connector", null
            ), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Saved connector successfully", savedPoint
        ), HttpStatus.OK);
    }

    private ResponseEntity<ResponseObject<Object>> handleConnectorDeleteEvent(String connectorId, String companyId) {
        if (connectorId == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Connector id is required", null
            ), HttpStatus.BAD_REQUEST);
        }
        if (businessService.deleteConnector(connectorId, companyId)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Deleted connector successfully", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Something went wrong when deleting connector", false
        ), HttpStatus.BAD_REQUEST);
    }

    private ConnectorEventPayload buildConnectorEventPayload(StationEventPayload payload) {
        if (payload == null) {
            return null;
        }
        ConnectorEventPayload connectorEventPayload = new ConnectorEventPayload();
        connectorEventPayload.setStationId(payload.getStationId());
        connectorEventPayload.setChargePointId(payload.getChargePointId());
        connectorEventPayload.setConnector(payload.getConnector());
        return connectorEventPayload;
    }

    @PutMapping("stations/{id}/charging_points")
    @Operation(summary = "API thêm vào hoặc cập nhật điểm sạc và connector, với id là id trạm sạc")
    public ResponseEntity<ResponseObject<PointCreationDTO>> updatePoint(
            @PathVariable("id") String id,
            @org.springframework.web.bind.annotation.RequestBody PointCreationDTO point,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        PointCreationDTO createdChargingPoint = businessService.addOrModifyChargingPoint(
                point, id, principal.getCompanyId()
        );
        if (createdChargingPoint == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Something went wrong when deleting station", null
            ), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Deleted station successfully", createdChargingPoint
        ), HttpStatus.OK);
    }

    @DeleteMapping("stations/charging_points/{id}")
    @Operation(summary = "API xóa điểm sạc (charging points) bằng id")
    public ResponseEntity<ResponseObject<Boolean>> deleteChargingPoint(
            @PathVariable("id") String pointId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (businessService.deleteChargingPoint(pointId, principal.getCompanyId())) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Deleted station successfully", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Something went wrong when deleting charging point", false
        ), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("stations/charging_points/connectors/{id}")
    @Operation(summary = "API xóa connector bằng id")
    public ResponseEntity<ResponseObject<Boolean>> deleteConnector(
            @PathVariable("id") String connectorId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (businessService.deleteConnector(connectorId, principal.getCompanyId())) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Deleted station successfully", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Something went wrong when deleting charging point", false
        ), HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "stations/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "API doanh nghiệp thêm ảnh mới vào trạm sạc")
    public ResponseEntity<ResponseObject<Boolean>> addNewImageToStation(@RequestPart("imageFile") MultipartFile newImage, @PathVariable String id, @AuthenticationPrincipal UserPrincipal userPrincipal) throws IOException {
        String companyId = userPrincipal.getCompanyId();
        if (businessService.addImageToStation(newImage, id, companyId)) {
            return new ResponseEntity<>(
                    new ResponseObject<>(
                            HttpStatus.OK,
                            "change image successfully",
                            true
                    ), HttpStatus.OK
            );
        }
        return new ResponseEntity<>(
                new ResponseObject<>(
                        HttpStatus.BAD_REQUEST,
                        "Image file type is not allowed",
                        false
                ), HttpStatus.BAD_REQUEST
        );

    }

    @PutMapping(value = "stations/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "API chỉnh sửa hình ảnh đã có của trạm sạc")
    public ResponseEntity<ResponseObject<Boolean>> changeImage(@ModelAttribute StationImageRequestDTO imageRequest,
                                                              @PathVariable String id,
                                                               @AuthenticationPrincipal UserPrincipal principal) throws IOException {
        String companyId = principal.getCompanyId();
        boolean isUpdated = businessService.changeImage(imageRequest, id, companyId);
        if (isUpdated) {
            return new ResponseEntity<>(
                    new ResponseObject<>(
                            HttpStatus.OK,
                            "change image successfully",
                            true
                    ), HttpStatus.OK
            );
        }
        return new ResponseEntity<>(
                new ResponseObject<>(
                        HttpStatus.BAD_REQUEST,
                        "Image file type is not allowed",
                        false
                ), HttpStatus.BAD_REQUEST
        );
    }

    @DeleteMapping("stations/image/{key}")
    @Operation(summary = "Xóa hình ảnh đã có của trạm sạc")
    public ResponseEntity<ResponseObject<Boolean>> deleteImage(@PathVariable String key) {
        boolean isDeleted = businessService.deleteStation(key);
        if (isDeleted) {
            return new ResponseEntity<>(
                    new ResponseObject<>(
                            HttpStatus.OK,
                            "change image successfully",
                            true
                    ), HttpStatus.OK
            );
        }
        return new ResponseEntity<>(
                new ResponseObject<>(
                        HttpStatus.BAD_REQUEST,
                        "Image file type is not allowed",
                        false
                ), HttpStatus.BAD_REQUEST
        );
    }

    @PutMapping("stations/{id}/status")
    @Operation(summary = "Toggle bật tắt trạng thái trạm sạc",
    description = "Toggle bật tắt status của trạm sạc với id là id trạm sạc")
    public ResponseEntity<ResponseObject<Boolean>> toggleStationStatus(@PathVariable String id) {
        if (businessService.toggleStationStatus(id)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK,
                    "Toggle successfully",
                    true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Toggle unsuccessfully",
                false
        ), HttpStatus.OK);
    }
}

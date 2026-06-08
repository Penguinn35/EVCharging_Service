package com.dacn.backend.controller;

import com.dacn.backend.constants.ConnectorStatus;
import com.dacn.backend.dto.response_from_externals.CpoResponse;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.CpoSyncService;
import com.dacn.backend.service.StationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

@RestController
@RequestMapping("/ocpi/cpo/2.2.1/stations")
@Tag(name = "OCPI API", description = "Dành cho các CPO gọi API đến để update trạm sạc")
public class OCPI2_2_1Controller {

    @Autowired
    private StationService stationService;
    @Autowired
    private CpoSyncService cpoSyncService;

    @PatchMapping("/connector/status")
    public ResponseEntity<ResponseObject<Boolean>> updateChargingPointStatus(
            @RequestParam("connectorId") String connectorId,
            @RequestParam("status") ConnectorStatus status
    ) {
        if (stationService.updateConnectorStatus(connectorId, status)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.CREATED,
                    "Updated status " + status + " to charging point with id " + connectorId,
                    true
            ), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST,
                    "Unable to find the charging point with id " + connectorId,
                    false
            ), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("vehicle-count")
    public ResponseEntity<ResponseObject<Boolean>> updateVehicleCount(
            @RequestParam("stationId") String stationId, @RequestParam("vehicleCount") Long vehicleCount
    ) {
        if (stationService.updateCurrentVehicleCount(stationId, vehicleCount)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.CREATED,
                    "Updated vehicle count " + vehicleCount + " to charging station with id " + stationId,
                    true
            ), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST,
                "Unable to find the charging station with id " + stationId,
                false
        ), HttpStatus.BAD_REQUEST);
    }

    @PutMapping("pull-data")
    public ResponseEntity<ResponseObject<Boolean>> pullDataFromCPOServer(
            @AuthenticationPrincipal UserPrincipal principal)
    {
        String externalUrl = principal.getCPOServerUrl();
        String token = principal.getCPOServerToken();
        RestClient client = RestClient.create();
        CpoResponse responseBody = client.get()
                .uri(externalUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .body(CpoResponse.class); // Tự động mapping JSON sang Object nhờ Jackson

        // Tiến hành kiểm tra dữ liệu lấy về thành công
        if (responseBody != null && responseBody.data() != null) {
            // TODO: Xử lý dữ liệu sau khi đã lấy thành công (lưu database, cập nhật trạng thái...)
            System.out.println("Đã lấy được dữ liệu, số lượng trạm sạc: " + responseBody.data().size());

            cpoSyncService.syncStationsFromCPO(responseBody.data(), principal.getCompanyId());
            return ResponseEntity.ok(new ResponseObject<>(HttpStatus.OK,
                    "Lấy dữ liệu từ CPO thành công", true));
        }

        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Cannot pull data from cpo server", false
        ), HttpStatus.BAD_REQUEST);
    }
}

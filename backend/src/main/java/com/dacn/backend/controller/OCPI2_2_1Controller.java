package com.dacn.backend.controller;

import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.StationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ocpi/cpo/2.2.1/stations")
@Tag(name = "OCPI API", description = "Dành cho các CPO gọi API đến để update trạm sạc")
public class OCPI2_2_1Controller {

    @Autowired
    private StationService stationService;

    @PatchMapping("/charging_point/status")
    public ResponseEntity<ResponseObject<Boolean>> updateChargingPointStatus(
            @RequestParam("chargingPointId") String pointId,
            @RequestParam("status") int status
    ) {
        if (stationService.updateChargingPointStatus(pointId, status)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.CREATED,
                    "Updated status " + status + " to charging point with id " + pointId,
                    true
            ), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST,
                    "Unable to find the charging point with id " + pointId,
                    false
            ), HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("vehicle-count")
    public ResponseEntity<ResponseObject<Boolean>> updateVehicleCount(@RequestParam("stationId") String stationId,
                                                                      @RequestParam("vehicleCount") Long vehicleCount) {
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
}

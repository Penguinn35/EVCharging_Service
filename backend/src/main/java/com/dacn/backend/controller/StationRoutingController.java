package com.dacn.backend.controller;

import com.dacn.backend.model.type.Coordinate;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.StationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stations/route")
@Tag(name = "API routing trạm sạc", description = "Danh sách api chỉ đường đến trạm sạc")
@ApiResponses(
        value = {
                @ApiResponse(responseCode = "500", description = "Lỗi database hoặc lỗi hệ thống")
        }
)
public class StationRoutingController {

    @Autowired
    private StationService stationService;

    @GetMapping("")
    @Operation(
            summary = "API tìm đường đi đến trạm sạc",
            description = "Trả về chuỗi GeoJson đường đi từ vị trí (longitude, latitude) đến trạm sạc với stationId"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công"),
                    @ApiResponse(responseCode = "404", description = "Không tìm thấy trạm sạc với tên đó")
            }
    )
    public ResponseEntity<ResponseObject<String>> getRouteOfStation(@RequestParam Double longitude, @RequestParam Double latitude, @RequestParam String stationId) {
        return new ResponseEntity<>((
                new ResponseObject<>(HttpStatus.OK, "Returned successfully",
                        stationService.routingToStation(new Coordinate(longitude, latitude), stationId))
        ), HttpStatus.OK);
    }
}

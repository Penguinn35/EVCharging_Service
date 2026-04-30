package com.dacn.backend.controller;

import com.dacn.backend.dto.*;
import com.dacn.backend.dto.search_by_keyword.StationSearchResponseDTO;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/stations")
@Tag(name = "API trạm sạc", description = "Danh sách api trạm sạc")
@ApiResponses(
        value = {
                @ApiResponse(responseCode = "500", description = "Lỗi database hoặc lỗi hệ thống")
        }
)
public class StationController {

    @Autowired
    private StationService stationService;

    @GetMapping("")
    @Operation(
            summary = "API tìm kiếm trạm sạc theo từ khóa",
            description = "Trả về tên và id của 5 trạm sạc dựa trên keyword.\n Note: Nhớ thêm vào extension 'unaccent' cho db"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công"),
            }
    )
    public ResponseEntity<ResponseObject<List<StationSearchResponseDTO>>> getStationByKeywords(@RequestParam String keyword) {
        // return new ResponseEntity<>(stationService.searchByKeyword(keyword), HttpStatus.OK);
        List<StationSearchResponseDTO> responses = stationService.searchByKeyword(keyword);
        return new ResponseEntity<>(
                new ResponseObject<>(HttpStatus.OK, "Returned successfully", responses, responses.size()),
                HttpStatus.OK
        );
    }

    @GetMapping("nearest-station")
    @Operation(
            summary = "API tìm trạm sạc gần đây",
            description = "Trả về tên và id của 5 trạm sạc gần đây nhất. Sử dụng Euclidean distance để tính toán khoảng cách"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công các trạm sạc.\nStatus: 0 = UNAVAILABLE; 1 = AVAILABLE; 2 = BUSY; 3 = FULL"),
                    @ApiResponse(responseCode = "404", description = "Không tìm thấy trạm sạc")
            }
    )
    public ResponseEntity<ResponseObject<List<StationByLocationResponseDTO>>> getStationByLocation(@RequestParam Double longitude, @RequestParam Double latitude) {
        Coordinate position = new Coordinate(longitude, latitude);
        List<StationByLocationResponseDTO> responses = stationService.searchByLocation(position);
        if (!responses.isEmpty()) {
            return new ResponseEntity<>(
                    new ResponseObject<>(HttpStatus.OK, "Returned successfully", responses, responses.size()),
                    HttpStatus.OK
            );
        }
        return new ResponseEntity<>(
                new ResponseObject<>(HttpStatus.NOT_FOUND, "Cannot find any stations", null),
                HttpStatus.NOT_FOUND
        );
    }

    @GetMapping("{id}")
    @Operation(
            summary = "API thông tin chi tiết trạm sạc",
            description = "Input là id của trạm sạc, trả về các thông tin của trạm sạc với id đó"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công thông tin trạm sạc"),
                    @ApiResponse(responseCode = "404", description = "Không có trạm sạc với id đó")
            }
    )
    public ResponseEntity<ResponseObject<StationDetailResponseDTO>> viewStationDetails(@PathVariable String id) {
        StationDetailResponseDTO stationDetail = stationService.getStationDetail(id);
        if (stationDetail == null) {
            return new ResponseEntity<>(new ResponseObject<>(HttpStatus.NOT_FOUND, "Cannot find the station with that id"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ResponseObject<>(HttpStatus.OK, "Successfully returned the station detail", stationDetail), HttpStatus.OK);
    }

    @GetMapping("logos")
    public ResponseEntity<ResponseObject<List<LogoResponseDTO>>> getLogos(@RequestParam(required = false) List<String> manufacturerNames) {
        List<LogoResponseDTO> logoResponse;
        if (manufacturerNames == null) {
            logoResponse = stationService.getAllLogos();
        } else {
            logoResponse = stationService.getLogosByNames(manufacturerNames);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Returned successfully",
                logoResponse,
                logoResponse.size()
        ), HttpStatus.OK);
    }

}

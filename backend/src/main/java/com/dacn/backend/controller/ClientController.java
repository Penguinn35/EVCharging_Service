package com.dacn.backend.controller;

import com.dacn.backend.dto.RatingRequestDTO;
import com.dacn.backend.dto.RatingResponseDTO;
import com.dacn.backend.dto.search_by_keyword.StationSearchResponseDTO;
import com.dacn.backend.model.Rating;
import com.dacn.backend.object.ResponseObject;
import org.springframework.web.bind.annotation.*;

import com.dacn.backend.dto.StationDetailResponseDTO;
import com.dacn.backend.dto.UserStationCategoriesRequestDTO;
import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;
import com.dacn.backend.model.type.Coordinate;
import com.dacn.backend.service.StationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("api/client/stations")
@Tag(name = "API trạm sạc khách hàng")
@ApiResponses(
        value = {
                @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token hết hạn"),
                @ApiResponse(responseCode = "500", description = "Lỗi database hoặc lỗi hệ thống")
        }
)
public class ClientController {
    @Autowired
    StationService stationService;

    // @GetMapping("stations")
    // @Tag(name = "Trả về tất cả các trạm sạc")
    // public ResponseEntity<List<ChargingStation>> getAllStations() {
    //     return new ResponseEntity<List<ChargingStation>>(stationService.getAllStations(), HttpStatus.OK);
    // }

    @GetMapping("search")
    @Operation(
        summary = "API tìm kiếm trạm sạc theo từ khóa", 
        description = "Trả về tên và id của 5 trạm sạc dựa trên keyword.\n Note: Nhớ thêm vào extension 'unaccent' cho db"
    )
    @ApiResponses(
        value = {
            @ApiResponse(responseCode = "200", description = "Trả về thành công các trạm sạc"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy trạm sạc")
        }
    )
    public ResponseEntity<ResponseObject<List<StationSearchResponseDTO>>> getStationByKeywords(@RequestParam String keyword) {
        // return new ResponseEntity<>(stationService.searchByKeyword(keyword), HttpStatus.OK);
        List<StationSearchResponseDTO> responses = stationService.searchByKeyword(keyword);
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

    @PostMapping("near")
    @Operation(
        summary = "API tìm trạm sạc gần đây", 
        description = "Trả về tên và id của 5 trạm sạc gần đây nhất. Sử dụng Euclidean distance để tính toán khoảng cách"
    )
    public ResponseEntity<ResponseObject<List<StationResponseDTO>>> getStationByLocation(@RequestBody Coordinate position) {
        List<StationResponseDTO> responses = stationService.searchByLocation(position);
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

    @PostMapping("suggestion")
    @Operation(
        summary = "API gợi ý trạm sạc",
        description = "Trả về 1 trạm sạc phù hợp với loại đầu sạc thường được sử dụng và vị trí hiện tại gần nhất của người dùng"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công thông tin trạm sạc được gợi ý"),
                    @ApiResponse(responseCode = "404", description = "Không có trạm sạc phù hợp với yêu cầu của bạn, vui lòng kiểm tra input")
            }
    )
    public ResponseEntity<ResponseObject<StationResponseDTO>> suggestStation(@RequestBody UserStationCategoriesRequestDTO categories) {
        StationResponseDTO response = stationService.getSuggestedStation(categories);
        if (response == null) {
            return new ResponseEntity<>(new ResponseObject<>(HttpStatus.NOT_FOUND, "Cannot find the suggested station"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ResponseObject<>(HttpStatus.OK, "Successfully returned the suggested station", response), HttpStatus.OK);
    }

    
    
    @PutMapping("rating")
    @Operation(
            summary = "API thêm vào đánh giá cho 1 trạm sạc",
            description = "Người dùng nhập vào đánh giá bằng số sao, comment, db sẽ lưu lại trạm sạc đó."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "201", description = "Lưu thành công đánh giá"),
                    @ApiResponse(responseCode = "400", description = "Input bị lỗi, cần kiểm tra lại input")
            }
    )
    public ResponseEntity<ResponseObject<RatingResponseDTO>> sendRating(@RequestBody RatingRequestDTO rating) {
        //TODO: process POST request
        RatingResponseDTO response = null;
        try {
            response = stationService.rateStation(rating);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    new ResponseObject<>(
                            HttpStatus.BAD_REQUEST,
                            "Something wrong with input (either duplicate entries or no entities found with this id"
                    ),
                    HttpStatus.BAD_REQUEST
            );
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.CREATED, "Send rating from user successfully", response
        ), HttpStatus.CREATED);
    }

    @GetMapping("ratings")
    public ResponseEntity<ResponseObject<List<RatingResponseDTO>>> ratingsOfStation(@RequestParam String stationId) {
        List<RatingResponseDTO> reviews = null;
        try {
            reviews = stationService.getRatingListOfStation(stationId);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    new ResponseObject<>(
                            HttpStatus.BAD_REQUEST,
                            "Something wrong with database"
                    ),
                    HttpStatus.BAD_REQUEST
            );
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.CREATED, "Send rating from user successfully", reviews, reviews.size()
        ), HttpStatus.CREATED);
    }
    
}
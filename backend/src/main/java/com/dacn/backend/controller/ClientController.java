package com.dacn.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dacn.backend.dto.StationDetailResponseDTO;
import com.dacn.backend.dto.UserStationCategoriesRequestDTO;
import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;
import com.dacn.backend.model.Rating;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;




@RestController
@RequestMapping("api/client/stations")
@Tag(name = "API trạm sạc khách hàng")
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
    public ResponseEntity<List<StationResponseDTO>> getStationByKeywords(@RequestParam String keyword) {
        // return new ResponseEntity<>(stationService.searchByKeyword(keyword), HttpStatus.OK);
        List<StationResponseDTO> responses = stationService.searchByKeyword(keyword);
        if (responses.size() > 0) {
            return new ResponseEntity<>(responses, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("near")
    @Operation(
        summary = "API tìm trạm sạc gần đây", 
        description = "Trả về tên và id của 5 trạm sạc gần đây nhất. Sử dụng Euclidean distance để tính toán khoảng cách"
    )
    public ResponseEntity<List<StationResponseDTO>> getStationByLocation(@RequestBody Coordinate position) {
        List<StationResponseDTO> responses = stationService.searchByLocation(position);
        return new ResponseEntity<>(responses, HttpStatus.OK);
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
    public ResponseEntity<StationDetailResponseDTO> viewStationDetails(@PathVariable String id) {
        StationDetailResponseDTO stationDetail = stationService.getStationDetail(id);
        if (stationDetail == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(stationDetail, HttpStatus.OK);
    }

    @PostMapping("suggestion")
    @Operation(
        summary = "API gợi ý trạm sạc",
        description = "Trả về 1 trạm sạc phù hợp với loại đầu sạc thường được sử dụng và vị trí hiện tại gần nhất của người dùng"
    )
    public ResponseEntity<StationResponseDTO> suggestStation(@RequestBody UserStationCategoriesRequestDTO categories) {
        return new ResponseEntity<>(stationService.getSuggestedStation(categories), HttpStatus.OK);
    }

    
    
    @PostMapping("rating")
    public ResponseEntity<Rating> postMethodName(@RequestBody Rating rating) {
        //TODO: process POST request
        
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
}
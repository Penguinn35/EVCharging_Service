package com.dacn.backend.controller;

import com.dacn.backend.dto.CoordinateDTO;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessHotspotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/business")
@Tag(name = "API doanh nghiệp quản lý hotspots")
public class BusinessHotspotController {
    @Autowired
    private BusinessHotspotService hotspotService;

    @GetMapping("suggestion")
    @Operation(summary = "API trả về tất cả các dữ liệu gợi ý từ người dùng")
    public ResponseEntity<ResponseObject<List<CoordinateDTO>>> getSuggestionData() {
        List<CoordinateDTO> response = hotspotService.getSuggestions();
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Suggestion list returned",
                response,
                response.size()
        ), HttpStatus.OK);
    }

    @GetMapping("users/locations")
    @Operation(summary = "API trả về các dữ liệu vị trí khi người dùng gọi gợi ý trạm sạc")
    public ResponseEntity<ResponseObject<List<CoordinateDTO>>> getUserLocationHistory() {
        List<CoordinateDTO> response = hotspotService.getLocationHistory();
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Location history list returned",
                response,
                response.size()
        ), HttpStatus.OK);
    }
}

package com.dacn.backend.controller;

import com.dacn.backend.annotation.RequiresVerifiedCpo;
import com.dacn.backend.dto.HitfullResponseDTO;
import com.dacn.backend.dto.UserLocationHistoryDTO;
import com.dacn.backend.dto.UserSuggestedStationDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessHotspotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/business")
@Tag(name = "API doanh nghiệp quản lý hotspots")
@RequiresVerifiedCpo
public class BusinessHotspotController {
    @Autowired
    private BusinessHotspotService hotspotService;

    @GetMapping("suggestion")
    @Operation(summary = "API trả về tất cả các dữ liệu gợi ý từ người dùng")
    public ResponseEntity<ResponseObject<List<UserSuggestedStationDTO>>> getSuggestionData(
            @RequestParam Double longitude, @RequestParam Double latitude, @RequestParam Double radius,
            @RequestParam(value = "fromDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(value = "toDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate
    ) {
        List<UserSuggestedStationDTO> response = hotspotService.getSuggestions(longitude, latitude, radius,
                fromDate, toDate);
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Suggestion list returned",
                response,
                response.size()
        ), HttpStatus.OK);
    }

    @GetMapping("users/locations")
    @Operation(summary = "API trả về các dữ liệu vị trí khi người dùng gọi gợi ý trạm sạc")
    public ResponseEntity<ResponseObject<List<UserLocationHistoryDTO>>> getUserLocationHistory() {
        List<UserLocationHistoryDTO> response = hotspotService.getLocationHistory();
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Location history list returned",
                response,
                response.size()
        ), HttpStatus.OK);
    }

    @GetMapping("stations/hitfull-count")
    @Operation(summary = "API trả về hitfull count của tất cả các station thuộc doanh nghiệp")
    public ResponseEntity<ResponseObject<List<HitfullResponseDTO>>> getHitFullOfAllStations(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Double longitude,
            @RequestParam Double latitude,
            @RequestParam Double radius,

            @RequestParam(value = "fromDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(value = "toDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate
            ) {
        List<HitfullResponseDTO> response = hotspotService.getHitfullCount(principal.getCompanyId(), longitude,
                latitude, radius, fromDate, toDate);
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Hitfull count list is returned", response, response.size()
        ), HttpStatus.OK);
    }
}

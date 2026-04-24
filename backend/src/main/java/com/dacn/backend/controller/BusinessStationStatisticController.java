package com.dacn.backend.controller;

import com.dacn.backend.dto.StatisticsByStationResponseDTO;
import com.dacn.backend.dto.StatisticsResponseDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessStationStatisticService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/business/stations")
@Tag(name = "API dành cho thống kê trạm sạc của doanh nghiệp", description = "Các API cho doanh nghiệp thống kê số liệu các trạm sạc của mình")
public class BusinessStationStatisticController {
    @Autowired
    private BusinessStationStatisticService statisticService;

    @GetMapping("/statistics/total-detail-count")
    @Operation(summary = "API lấy tổng lượt nhấp vào stationDetail theo từng trạm sạc của doanh nghiệp. Input liên quan tới date có dạng: yyyy-MM-dd")
    public ResponseEntity<ResponseObject<List<StatisticsResponseDTO>>> getStationViewCountWithRange(
            @RequestParam("fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam("toDate") LocalDate toDate,
            @AuthenticationPrincipal UserPrincipal principal
            ) {
        List<StatisticsResponseDTO> response = statisticService.getTotalViewCountByDateRange(fromDate, toDate, principal.getCompanyId());
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Returned successfully",
                response,
                response.size()
        ), HttpStatus.OK) ;
    }

    @GetMapping("{id}/statistics/detail-count")
    public ResponseEntity<ResponseObject<List<StatisticsByStationResponseDTO>>> getStationViewCount(
            @PathVariable("id") String stationId,
            @RequestParam("fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam("toDate") LocalDate toDate,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<StatisticsByStationResponseDTO> response = statisticService.getTotalViewCountByStationId(stationId, fromDate, toDate, principal.getCompanyId());
        if (response == null) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST,
                    "Invalid station id",
                    null
            ), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "return successfully",
                response,
                response.size()
        ), HttpStatus.OK);
    }

}

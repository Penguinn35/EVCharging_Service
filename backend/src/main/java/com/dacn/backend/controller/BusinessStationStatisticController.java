package com.dacn.backend.controller;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/business/stations/statistics")
@Tag(name = "API dành cho thống kê trạm sạc của doanh nghiệp", description = "Các API cho doanh nghiệp thống kê số liệu các trạm sạc của mình")
public class BusinessStationStatisticController {
    @Autowired
    private BusinessStationStatisticService statisticService;

    @GetMapping("")
    @Operation(summary = "API lấy tổng lượt nhấp vào stationDetail theo từng trạm sạc của doanh nghiệp")
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

}

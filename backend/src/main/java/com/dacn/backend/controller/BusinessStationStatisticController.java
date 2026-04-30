package com.dacn.backend.controller;

import com.dacn.backend.dto.SaveStatisticResponseDTO;
import com.dacn.backend.dto.StatisticsByStationResponseDTO;
import com.dacn.backend.dto.StatisticsResponseDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessStationStatisticService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/business/stations")
@Tag(name = "API dành cho thống kê trạm sạc của doanh nghiệp", description = "Các API cho doanh nghiệp thống kê số liệu các trạm sạc của mình")
public class BusinessStationStatisticController {
    @Autowired
    private BusinessStationStatisticService statisticService;

    @GetMapping("/statistics/total-detail-count")
    @Operation(
            summary = "API thống kê lượt nhấp vào trang chi tiết trạm sạc của doanh nghiệp.",
            description = "Nhập vào dữ liệu ngày tháng có dạng 'yyyy-MM-dd', "
            + "trả về tổng số lượt nhấp vào trang detail theo từng trạm sạc của doanh nghiệp gọi đến "
            + "trong khoảng fromDate đến toDate"
    )
    public ResponseEntity<ResponseObject<Page<StatisticsResponseDTO>>> getStationViewCountWithRange(
            @RequestParam("fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam("toDate") LocalDate toDate,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
            ) {
        Page<StatisticsResponseDTO> response = statisticService.getTotalViewCountByDateRange(fromDate, toDate, principal.getCompanyId(), page, size);
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Returned successfully",
                response,
                response.getSize()
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

    @GetMapping("/statistics/save-station-count")
    public ResponseEntity<ResponseObject<Page<SaveStatisticResponseDTO>>> getSaveStationStat(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<SaveStatisticResponseDTO> response = statisticService.getSaveStationStatistic(
                principal.getCompanyId(), page, size
        );
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
                response.getSize()
        ), HttpStatus.OK);
    }

    @GetMapping("{id}/statistics/save-station-count")
    public ResponseEntity<ResponseObject<List<SaveStatisticResponseDTO>>> getSaveStationStatById(
            @PathVariable("id") String stationId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<SaveStatisticResponseDTO> response = statisticService.getSaveStationStatisticByStationId(
                stationId,
                principal.getCompanyId()
        );
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

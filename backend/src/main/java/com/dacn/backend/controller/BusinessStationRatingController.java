package com.dacn.backend.controller;

import com.dacn.backend.annotation.RequiresVerifiedCpo;
import com.dacn.backend.dto.BusinessRatingResponseDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessStationRatingService;
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

@RestController
@RequestMapping("api/business")
@Tag(name = "API dành cho doanh nghiệp quản lý đánh giá trạm sạc",
        description = "Các API cho doanh nghiệp quản lý các đánh giá của các trạm sạc của mình")
@RequiresVerifiedCpo
public class BusinessStationRatingController {
    @Autowired
    private BusinessStationRatingService ratingService;

    @GetMapping("stations/ratings")
    @Operation(
            summary = "API lấy dữ liệu rating từ khách hàng"
    )
    public ResponseEntity<ResponseObject<BusinessRatingResponseDTO>> getRatingOfBusiness(
            @RequestParam(value = "fromDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(value = "toDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate,

            @RequestParam(value = "lowestPoint", defaultValue = "0") int lowestPoint,
            @RequestParam(value = "highestPoint", defaultValue = "5") int highestPoint,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String companyId = principal.getCompanyId();
        BusinessRatingResponseDTO ratingResponses = null;
        if (fromDate == null && toDate == null) {
            ratingResponses = ratingService.getRatingWithNoFilter(companyId, page, size);
        }
        else {
            ratingResponses = ratingService.getRatingWithFilter(fromDate, toDate, lowestPoint, highestPoint,
                    companyId, page, size);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Returned successfully",
                ratingResponses
        ), HttpStatus.OK);
    }
}

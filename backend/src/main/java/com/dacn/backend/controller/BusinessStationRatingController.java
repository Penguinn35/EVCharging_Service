package com.dacn.backend.controller;

import com.dacn.backend.dto.RatingResponseDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessStationRatingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
public class BusinessStationRatingController {
    @Autowired
    private BusinessStationRatingService ratingService;

    @GetMapping("stations/ratings")
    public ResponseEntity<ResponseObject<Page<RatingResponseDTO>>> getRatingOfBusiness(
            @RequestParam(value = "fromDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(value = "toDate", required = false) LocalDate toDate,

            @RequestParam(value = "ratingPoint", required = false) Integer ratingPoint,
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String companyId = principal.getCompanyId();
        Page<RatingResponseDTO> response = null;
        if (fromDate == null && toDate == null && ratingPoint == null) {
            response = ratingService.getRatingWithNoFilter(companyId, page, size);
        }
        else {
            response = ratingService.getRatingWithFilter(fromDate, toDate, ratingPoint,
                    companyId, page, size);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK,
                "Returned successfully",
                response,
                response.getSize()
        ), HttpStatus.OK);
    }
}

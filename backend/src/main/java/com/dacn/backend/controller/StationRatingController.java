package com.dacn.backend.controller;

import com.dacn.backend.dto.RatingRequestDTO;
import com.dacn.backend.dto.RatingResponseDTO;
import com.dacn.backend.dto.RatingStatisticDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.StationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations/ratings")
@Tag(name = "API đánh giá của trạm sạc", description = "Danh sách api tương tác với các đánh giá từ người dùng về trạm sạc")
@ApiResponses(
        value = {
                @ApiResponse(responseCode = "500", description = "Lỗi database hoặc lỗi hệ thống")
        }
)
public class StationRatingController {

    @Autowired
    private StationService stationService;

    @GetMapping("")
    @Operation(
            summary = "API lấy danh sách đánh giá của 1 trạm sạc",
            description = "Trả về danh sách các đánh giá trong cùng 1 trạm sạc, hỗ trợ paging"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công"),
                    @ApiResponse(responseCode = "404", description = "Không tìm thấy trạm sạc với tên đó")
            }
    )
    public ResponseEntity<ResponseObject<Page<RatingResponseDTO>>> ratingsOfStation(
            @RequestParam String stationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<RatingResponseDTO> reviews = stationService.getRatingListOfStation(stationId, page, size);
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.CREATED, "Send rating from user successfully", reviews, reviews.getTotalElements()
        ), HttpStatus.CREATED);
    }

    @GetMapping("statistics")
    @Operation(
            summary = "API số lượng thống kê của rating theo trạm sạc",
            description = "Trả về số rating theo từng số sao đối với trạm sạc đó"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công"),
                    @ApiResponse(responseCode = "404", description = "Không tìm thấy trạm sạc với tên đó")
            }
    )
    public ResponseEntity<ResponseObject<List<RatingStatisticDTO>>> getRatingStatistics(@RequestParam String stationId) {
        List<RatingStatisticDTO> statistics = stationService.getRatingStatistic(stationId);
        return new ResponseEntity<>(new ResponseObject<>(HttpStatus.OK, "Returned successfully",
                statistics, statistics.size()), HttpStatus.OK);
    }

    @PostMapping("")
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
    public ResponseEntity<ResponseObject<RatingResponseDTO>> sendRating(@RequestBody RatingRequestDTO rating, @AuthenticationPrincipal UserPrincipal principal) {
        //TODO: process POST request
        RatingResponseDTO response;
        String userId = principal.getUserId();
        response = stationService.rateStation(userId, rating);
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.CREATED, "Send rating from user successfully", response
        ), HttpStatus.CREATED);
    }

}

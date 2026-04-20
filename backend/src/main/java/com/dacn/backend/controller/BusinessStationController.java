package com.dacn.backend.controller;

import com.dacn.backend.dto.StationCreationDTO;
import com.dacn.backend.dto.StationImageRequestDTO;
import com.dacn.backend.dto.search_by_keyword.StationSearchResponseDTO;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("api/business")
@Tag(name = "API dành cho doanh nghiệp", description = "Các API cho doanh nghiệp quản lý các trạm sạc của mình")
public class BusinessStationController {

    @Autowired
    private BusinessService businessService;

    @GetMapping("stations")
    @Operation(
            summary = "API tìm kiếm trạm sạc của doanh nghiệp",
            description = "Trả về các trạm sạc theo paging.\n Note: Nhớ thêm vào extension 'unaccent' cho db"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công"),
            }
    )
    public ResponseEntity<ResponseObject<Page<StationSearchResponseDTO>>> getBusinessStationByKeywords(@RequestParam String keyword,
                                                                                                       @RequestParam(defaultValue = "0") int page,
                                                                                                       @RequestParam(defaultValue = "10") int size,
                                                                                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return new ResponseEntity<>(
                new ResponseObject<>(
                        HttpStatus.OK,
                        "Returned successfully",
                        businessService.findStationByKeyword(keyword, page, size, userPrincipal.getCompanyId())),
                HttpStatus.OK);
    }

    @PostMapping(value = "stations", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequestBody(content = @Content(
            encoding = @Encoding(name = "newStation", contentType = "application/json")
    ))
    public ResponseEntity<ResponseObject<Boolean>> addNewStation(@RequestPart("newStation") StationCreationDTO newStation,
                                                                         @RequestPart("imageFiles") List<MultipartFile> newImage,
                                                                         @AuthenticationPrincipal UserPrincipal principal) throws IOException {
        boolean isStationAdded = businessService.addNewStation(newStation, newImage, principal.getCompanyId());
        if (isStationAdded) {
            return new ResponseEntity<>(
                    new ResponseObject<>(
                            HttpStatus.OK,
                            "saved successfully",
                            isStationAdded),
                            HttpStatus.OK);
        }
        return new ResponseEntity<>(
                new ResponseObject<>(HttpStatus.BAD_REQUEST,
                        "Image file type is not allowed",
                        null),
                HttpStatus.BAD_REQUEST
        );
    }

    @PutMapping(value = "stations/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject<Boolean>> changeImage(@RequestPart("imageFile") MultipartFile newImage, @PathVariable String id) throws IOException {
        if (businessService.addImageToStation(newImage, id)) {
            return new ResponseEntity<>(
                    new ResponseObject<>(
                            HttpStatus.OK,
                            "change image successfully",
                            true
                    ), HttpStatus.OK
            );
        }
        return new ResponseEntity<>(
                new ResponseObject<>(
                        HttpStatus.BAD_REQUEST,
                        "Image file type is not allowed",
                        null
                ), HttpStatus.BAD_REQUEST
        );

    }
}

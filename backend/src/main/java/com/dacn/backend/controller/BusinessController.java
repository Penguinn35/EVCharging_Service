package com.dacn.backend.controller;

import com.dacn.backend.annotation.RequiresVerifiedCpo;
import com.dacn.backend.dto.BusinessProfileDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/business")
@Tag(name = "API tài khoản doanh nghiệp")
@RequiresVerifiedCpo
public class BusinessController {
    @Autowired
    private BusinessAccountService businessAccountService;

    @GetMapping("profile")
    @Operation(summary = "API lấy thông tin chi tiết của doanh nghiệp")
    public ResponseEntity<ResponseObject<BusinessProfileDTO>> getBusinessProfile(
            @AuthenticationPrincipal UserPrincipal principal
            ) {
        BusinessProfileDTO response = businessAccountService.getBusinessProfile(principal.getCompanyId());
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Returned business detail", response
        ), HttpStatus.OK);
    }

    @PutMapping(value = "image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "API doanh nghiệp thêm/chỉnh sửa logo")
    public ResponseEntity<ResponseObject<Boolean>> updateLogo(
            @RequestPart("logoImage") MultipartFile newImage,
            @AuthenticationPrincipal UserPrincipal principal
    ) throws IOException {
        boolean isSaved = businessAccountService.saveLogo(newImage, principal.getCompanyId());
        if (isSaved) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.CREATED,
                    "Saved logo image successfully",
                    true
            ), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.BAD_REQUEST, "Saved logo unsuccessfully",
                    false
            ), HttpStatus.BAD_REQUEST);
        }
    }
}

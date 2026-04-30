package com.dacn.backend.controller;

import com.dacn.backend.dto.BusinessProfileDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.BusinessAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/business")
@Tag(name = "API tài khoản doanh nghiệp")
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
}

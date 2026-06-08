package com.dacn.backend.controller;

import com.dacn.backend.dto.CPOResponseDTO;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.AdminAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@Tag(name = "API dành cho admin quản lý doanh nghiệp")
public class AdminController {
    @Autowired
    private AdminAccountService adminAccountService;

    @GetMapping("cpos")
    @Operation(summary = "API trả về tất cả các doanh nghiệp hiện có, bao gồm cả verified và chưa verified")
    public ResponseEntity<ResponseObject<List<CPOResponseDTO>>> getAllCPOs() {
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Returned a list of cpos", adminAccountService.getAllCpoList()
        ), HttpStatus.OK);
    }

    @PutMapping("cpo/{id}/verification")
    @Operation(summary = "API verify tài khoản doanh nghiệp")
    public ResponseEntity<ResponseObject<Boolean>> verifyCPOProfile(@PathVariable("id") String enterpriseId) {
        if (adminAccountService.verifyCPOProfile(enterpriseId)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Verified cpo", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Verified failed, please recheck input", false
        ), HttpStatus.BAD_REQUEST);
    }

    @PutMapping("cpo/{id}/disable")
    @Operation(summary = "API khóa tài khoản doanh nghiệp")
    public ResponseEntity<ResponseObject<Boolean>> disableCPOProfile(@PathVariable("id") String enterpriseId) {
        if (adminAccountService.disableCPOProfile(enterpriseId)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Disabled cpo", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Disable failed, please recheck input", false
        ), HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("cpo/{id}")
    @Operation(summary = "API xóa tài khoản doanh nghiệp")
    public ResponseEntity<ResponseObject<Boolean>> deleteCPOProfile(@PathVariable("id") String enterpriseId) {
        if (adminAccountService.deleteCPOAccount(enterpriseId)) {
            return new ResponseEntity<>(new ResponseObject<>(
                    HttpStatus.OK, "Deleted cpo", true
            ), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.BAD_REQUEST, "Delete failed, please recheck input", false
        ), HttpStatus.BAD_REQUEST);
    }
}

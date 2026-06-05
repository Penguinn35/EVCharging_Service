package com.dacn.backend.controller;

import com.dacn.backend.dto.CPOResponseDTO;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.AdminAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/admin")
public class AdminController {
    @Autowired
    private AdminAccountService adminAccountService;

    @GetMapping("cpos")
    public ResponseEntity<ResponseObject<List<CPOResponseDTO>>> getAllCPOs() {
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Returned a list of cpos", adminAccountService.getAllCpoList()
        ), HttpStatus.OK);
    }
}

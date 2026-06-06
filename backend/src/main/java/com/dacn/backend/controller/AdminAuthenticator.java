package com.dacn.backend.controller;

import com.dacn.backend.dto.*;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.AdminAccountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/admin")
@Tag(name = "API tài khoản admin")
public class AdminAuthenticator {
    private final BCryptPasswordEncoder bEncoder = new BCryptPasswordEncoder(12);
    @Autowired
    private AdminAccountService adminAccountService;


    @PostMapping("/registration")
    public ResponseEntity<ResponseObject<Boolean>> registerUser(@RequestBody AdminRegisterDTO user) {
        //TODO: process POST request
        user.setPassword(bEncoder.encode(user.getPassword()));
        adminAccountService.saveAdminUser(user);
        return new ResponseEntity<>(new ResponseObject<>(HttpStatus.OK,
                "Created account successfully", Boolean.TRUE),
                HttpStatus.OK);
    }
}

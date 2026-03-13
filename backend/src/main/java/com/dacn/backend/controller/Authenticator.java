package com.dacn.backend.controller;

import com.dacn.backend.dto.LoginResponseDTO;
import com.dacn.backend.object.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

import com.dacn.backend.dto.LoginDTO;
import com.dacn.backend.dto.UserRegisterDTO;
import com.dacn.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("auth")
@Tag(name = "API đăng kí/ đăng nhập", description = "Dành cho việc đăng nhập, đăng kí và phân quyền")
public class Authenticator {
    @Autowired
    private UserService userService;
    private final BCryptPasswordEncoder bEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("register")
    @Operation(
            summary = "Đăng ký tài khoản người dùng mới",
            description = "Nhập tên người dùng, tài khoản, mật khẩu, email"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Đăng kí thành công và trả về id user"),
                    @ApiResponse(responseCode = "400", description = "Đăng kí thất bại")
            }
    )
    public ResponseEntity<ResponseObject<Boolean>> registerUser(@RequestBody UserRegisterDTO user) {
        //TODO: process POST request
        user.setPassword(bEncoder.encode(user.getPassword()));
//        return new ResponseEntity<Boolean>(userService.saveUser(user), HttpStatus.CREATED);
        try {
            userService.saveUser(user);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseObject<>(HttpStatus.BAD_REQUEST, "Unable to create account! Error message: " + e.getMessage(), Boolean.FALSE), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ResponseObject<>(HttpStatus.OK, "Created account successfully", Boolean.TRUE), HttpStatus.OK);
    }

    @PostMapping("login")
    @Operation(
            summary = "Đăng nhập tài khoản mật khẩu",
            description = "Nhập tên tài khoản mật khẩu, trả về token và userId"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Đăng nhập thành công"),
                    @ApiResponse(responseCode = "401", description = "Đăng nhập thất bại, sai tên tài khoản, mật khẩu")
            }
    )
    public ResponseEntity<ResponseObject<LoginResponseDTO>> loginUser(@RequestBody LoginDTO user) {
        //TODO: process POST request
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseObject<>(HttpStatus.UNAUTHORIZED, "Wrong password and username", null), HttpStatus.UNAUTHORIZED);
        }
//        return authentication.isAuthenticated() ?
//                new ResponseEntity<>(userService.generateToken(user.getUsername()), HttpStatus.OK) :
//                new ResponseEntity<String>("Login failed", HttpStatusCode.valueOf(403));
        if (authentication.isAuthenticated()) {
            LoginResponseDTO response = new LoginResponseDTO(
                    userService.generateToken(user.getUsername()),
                    userService.getUserId(user.getUsername())
            );
            return new ResponseEntity<>(new ResponseObject<>(HttpStatus.OK, "Successfully return token and user info", response), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResponseObject<>(HttpStatus.UNAUTHORIZED, "Wrong password and username"), HttpStatus.UNAUTHORIZED);
        }
    }
    
    
}

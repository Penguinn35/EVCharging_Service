package com.dacn.backend.controller;

import com.dacn.backend.dto.LoginResponseDTO;
import com.dacn.backend.object.ResponseObject;
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
public class Authenticator {
    @Autowired
    private UserService userService;
    private final BCryptPasswordEncoder bEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    private AuthenticationManager authenticationManager;
    


    @PostMapping("register")
    public ResponseEntity<ResponseObject<Boolean>> registerUser(@RequestBody UserRegisterDTO user) {
        //TODO: process POST request
        user.setPassword(bEncoder.encode(user.getPassword()));
//        return new ResponseEntity<Boolean>(userService.saveUser(user), HttpStatus.CREATED);
        try {
            userService.saveUser(user);
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseObject<>(Boolean.FALSE, "Unable to create account! Error message: " + e.getMessage()), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ResponseObject<>(true, "Created account successfully"), HttpStatus.OK);
    }

    @PostMapping("login")
    public ResponseEntity<ResponseObject<LoginResponseDTO>> loginUser(@RequestBody LoginDTO user) {
        //TODO: process POST request
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        } catch (Exception e) {
            return new ResponseEntity<>(new ResponseObject<>(null, "Wrong password and username"), HttpStatus.FORBIDDEN);
        }
//        return authentication.isAuthenticated() ?
//                new ResponseEntity<>(userService.generateToken(user.getUsername()), HttpStatus.OK) :
//                new ResponseEntity<String>("Login failed", HttpStatusCode.valueOf(403));
        if (authentication.isAuthenticated()) {
            LoginResponseDTO response = new LoginResponseDTO(
                    userService.generateToken(user.getUsername()),
                    userService.getUserId(user.getUsername())
            );
            return new ResponseEntity<>(new ResponseObject<>(response, "Successfully return token and user info"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResponseObject<>(null, "Wrong password and username"), HttpStatus.FORBIDDEN);
        }
    }
    
    
}

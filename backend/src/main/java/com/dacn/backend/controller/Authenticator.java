package com.dacn.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dacn.backend.dto.LoginDTO;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
    private BCryptPasswordEncoder bEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    private AuthenticationManager authenticationManager;
    


    @PostMapping("register")
    public ResponseEntity<EVUser> registerUser(@RequestBody EVUser user) {
        //TODO: process POST request
        user.setPassword(bEncoder.encode(user.getPassword()));
        return new ResponseEntity<EVUser>(userService.saveUser(user), HttpStatus.CREATED);
    }

    @PostMapping("login")
    public ResponseEntity<String> loginUser(@RequestBody LoginDTO user) {
        //TODO: process POST request
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        return authentication.isAuthenticated() ? new ResponseEntity<String>(userService.generateToken(user.getUsername()), HttpStatus.OK) : new ResponseEntity<String>("Login failed", HttpStatusCode.valueOf(403));
    }
    
    
}

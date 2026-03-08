package com.dacn.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dacn.backend.dto.LoginDTO;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("auth")
public class UserController {
    @Autowired
    private UserService userService;
    private BCryptPasswordEncoder bEncoder = new BCryptPasswordEncoder(12);

    @Autowired
    private AuthenticationManager authenticationManager;
    


    @PostMapping("register")
    public EVUser registerUser(@RequestBody EVUser user) {
        //TODO: process POST request
        user.setPassword(bEncoder.encode(user.getPassword()));
        return userService.saveUser(user);
    }

    @PostMapping("login")
    public String loginUser(@RequestBody LoginDTO user) {
        //TODO: process POST request
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        return authentication.isAuthenticated() ? userService.generateToken(user.getUsername()) : "Login Failed";
    }
    
    
}

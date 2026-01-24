package com.dacn.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("api/business")
public class BusinessController {

    @GetMapping("getsth")
    public String getMethodName() {
        return new String("Hello business");
    }
    
}

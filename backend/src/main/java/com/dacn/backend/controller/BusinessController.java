package com.dacn.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dacn.backend.model.ChargingStation;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("api/business")
public class BusinessController {

    @PostMapping("stations")
    public String addStation(@RequestBody ChargingStation station) {
        return new String("Hello business");
    }
    
}

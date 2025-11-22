package com.dacn.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.service.StationService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("api")
public class Controller {
    @Autowired
    StationService stationService;

    @GetMapping("stations")
    public ResponseEntity<List<ChargingStation>> getAllStations() {
        return new ResponseEntity<List<ChargingStation>>(stationService.getAllStations(), HttpStatus.OK);
    }
    
}

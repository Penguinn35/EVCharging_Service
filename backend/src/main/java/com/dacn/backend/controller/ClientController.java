package com.dacn.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.Rating;
import com.dacn.backend.service.StationService;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;




@RestController
@RequestMapping("api/client")
public class ClientController {
    @Autowired
    StationService stationService;

    @GetMapping("stations")
    @Tag(name = "Trả về tất cả các trạm sạc")
    public ResponseEntity<List<ChargingStation>> getAllStations() {
        return new ResponseEntity<List<ChargingStation>>(stationService.getAllStations(), HttpStatus.OK);
    }

    @GetMapping("station-search")
    public ResponseEntity<List<ChargingStation>> getStationByKeywords(@RequestParam String keyword) {
        return new ResponseEntity<>(stationService.searchByKeyword(keyword), HttpStatus.OK);
    }
    
    @GetMapping("station-filter")
    public ResponseEntity<List<ChargingStation>> findStationWithFilters(@RequestBody String filter) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("route")
    public ResponseEntity<String> getRoute(@RequestBody ChargingStation station) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("station")
    public ResponseEntity<ChargingStation> viewStationDetails(@RequestParam String param) {
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PostMapping("rating")
    public ResponseEntity<Rating> postMethodName(@RequestBody Rating rating) {
        //TODO: process POST request
        
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
}
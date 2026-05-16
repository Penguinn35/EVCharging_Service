package com.dacn.backend.controller;

import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.StationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api")
@Tag(name = "API trạm sạc", description = "Danh sách api trạm sạc")
public class DistrictController {
    @Autowired
    private StationService stationService;

    @GetMapping("districts")
    public ResponseEntity<ResponseObject<List<String>>>  getAllDistricts() {
        List<String> districts = stationService.getAllDistricts();
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Returned all districts", districts, districts.size()
        ), HttpStatus.OK);
    }
}

package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;

import lombok.Data;

@Data
public class StationDetailResponseDTO {
    String id;
    String name;
    String manufacturer;
    Coordinate position;
    String address;
    String status;
}

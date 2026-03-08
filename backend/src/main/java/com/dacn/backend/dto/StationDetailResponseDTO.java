package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;

import lombok.Data;

@Data
public class StationDetailResponseDTO {
    private String id;
    private String name;
    private String manufacturer;
    private Coordinate position;
    private String address;
    private String status;
}

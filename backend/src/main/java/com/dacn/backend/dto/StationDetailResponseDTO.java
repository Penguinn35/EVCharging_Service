package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;

import lombok.Data;

import java.util.List;

@Data
public class StationDetailResponseDTO {
    private String id;
    private String name;
    private String manufacturer;
    private Coordinate position;
    private String address;
    private String district;
    private int status;

    List<StationImageDTO> images;

    private List<ConnectorDTO> connectors;
}

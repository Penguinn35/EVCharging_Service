package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;
import lombok.Data;

import java.util.List;

@Data
public class StationCreationDTO {
    private String id;
    private String name;
    private String imageUrl;
    private Coordinate position;
    private String address;
    private String district;

    private List<PointCreationDTO> chargingPoints;

}

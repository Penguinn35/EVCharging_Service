package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationByLocationResponseDTO {
    private String id;
    private String name;
    private String manufacturer;
    private Double distanceInKilometers;
    private Coordinate position;
    private int status;

    public StationByLocationResponseDTO(String id, String name, String manufacturer, Double distanceInKilometers, Double longitude, Double latitude, int status) {
        this.id = id;
        this.name = name;
        this.manufacturer = manufacturer;
        this.distanceInKilometers = distanceInKilometers;
        this.position = new Coordinate(longitude, latitude);
        this.status = status;
    }
}

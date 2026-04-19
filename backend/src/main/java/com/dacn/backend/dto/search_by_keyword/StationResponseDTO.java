package com.dacn.backend.dto.search_by_keyword;

import com.dacn.backend.model.type.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StationResponseDTO {
    private String id;
    private String name;
    private String manufacturer;
    private String address;
    private Coordinate position;
    private Double distanceInKilometers;

    public StationResponseDTO(String id, String name, String manufacturer, String address, Double longitude, Double latitude, Double distanceInKilometers) {
        this.id = id;
        this.name = name;
        this.manufacturer = manufacturer;
        this.address = address;
        this.position = new Coordinate(longitude, latitude);
        this.distanceInKilometers = distanceInKilometers;
    }
}

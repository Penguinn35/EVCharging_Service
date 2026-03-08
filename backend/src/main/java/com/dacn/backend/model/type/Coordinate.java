package com.dacn.backend.model.type;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class Coordinate implements Serializable {
    private Double longitude;
    private Double latitude;

    public Double distanceToCoordinate(Coordinate other) {
        return Math.sqrt(Math.pow((this.longitude - other.getLongitude()), 2) + Math.pow(this.latitude - other.getLatitude(), 2));
    }
}

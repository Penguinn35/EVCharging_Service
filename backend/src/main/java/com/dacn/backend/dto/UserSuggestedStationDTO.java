package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserSuggestedStationDTO {
    private Coordinate location;
    private LocalDateTime timestamp;
    private String description;

    public UserSuggestedStationDTO(Double longitude, Double latitude, Object timestamp, String description) {
        this.location = new Coordinate(longitude, latitude);
        if (timestamp instanceof java.sql.Timestamp) {
            this.timestamp = ((java.sql.Timestamp) timestamp).toLocalDateTime();
        } else if (timestamp instanceof LocalDateTime) {
            this.timestamp = (LocalDateTime) timestamp;
        }
        this.description = description;
    }
}

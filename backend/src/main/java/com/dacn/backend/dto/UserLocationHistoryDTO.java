package com.dacn.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserLocationHistoryDTO {
    private CoordinateDTO location;
    private LocalDateTime timestamp;

    public UserLocationHistoryDTO(Object longitude, Object latitude, Object timestamp) {
        Double lon = (longitude instanceof Number) ? ((Number) longitude).doubleValue() : null;
        Double lat = (latitude instanceof Number) ? ((Number) latitude).doubleValue() : null;
        this.location = new CoordinateDTO(lon, lat);

        if (timestamp instanceof java.sql.Timestamp) {
            this.timestamp = ((java.sql.Timestamp) timestamp).toLocalDateTime();
        } else if (timestamp instanceof LocalDateTime) {
            this.timestamp = (LocalDateTime) timestamp;
        } else {
            this.timestamp = null;
        }
    }
}

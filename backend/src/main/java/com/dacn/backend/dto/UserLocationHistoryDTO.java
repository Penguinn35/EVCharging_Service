package com.dacn.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserLocationHistoryDTO {
    private CoordinateDTO location;
    private LocalDateTime timestamp;

    public UserLocationHistoryDTO(Double longitude, Double latitude, LocalDateTime timestamp) {
        this.location = new CoordinateDTO(longitude, latitude);
        this.timestamp = timestamp;
    }
}

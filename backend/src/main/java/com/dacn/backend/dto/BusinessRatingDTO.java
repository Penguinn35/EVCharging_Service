package com.dacn.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BusinessRatingDTO {
    private String stationName;
    private String comment;
    private int point;
    private LocalDateTime timePosted;

    public BusinessRatingDTO(Object stationName, Object comment, Object point, Object timePosted) {
        this.stationName = (String) stationName;
        this.comment = (String) comment;
        this.point = (point instanceof Number) ? ((Number) point).intValue() : 0;

        if (timePosted instanceof java.sql.Timestamp) {
            this.timePosted = ((java.sql.Timestamp) timePosted).toLocalDateTime();
        } else if (timePosted instanceof LocalDateTime) {
            this.timePosted = (LocalDateTime) timePosted;
        }
    }

}

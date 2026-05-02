package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
//@AllArgsConstructor
public class RatingResponseDTO {
    private String id;
    private String comment;
    private int point;
    private LocalDateTime timePosted;

    public RatingResponseDTO(Object id, Object comment, Object point, Object timePosted) {
        this.id = (String) id;
        this.comment = (String) comment;
        this.point = (point instanceof Number) ? ((Number) point).intValue() : 0;

        if (timePosted instanceof java.sql.Timestamp) {
            this.timePosted = ((java.sql.Timestamp) timePosted).toLocalDateTime();
        } else if (timePosted instanceof LocalDateTime) {
            this.timePosted = (LocalDateTime) timePosted;
        }
    }
}

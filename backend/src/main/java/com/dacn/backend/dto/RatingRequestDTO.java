package com.dacn.backend.dto;

import lombok.Data;

@Data
public class RatingRequestDTO {
    private String userId;
    private String stationId;
    private int point;
    private String comment;
}

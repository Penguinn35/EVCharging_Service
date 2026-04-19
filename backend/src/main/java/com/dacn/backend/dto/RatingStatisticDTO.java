package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RatingStatisticDTO {
    private int starPoint;
    private long totalNumberOfRating;
}

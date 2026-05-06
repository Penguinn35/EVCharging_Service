package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BusinessRatingTotalStatistics {
    private Long totalNumberOfRatings;
    private double averagePoint;
}

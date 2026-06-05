package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
//@AllArgsConstructor
@NoArgsConstructor
public class BusinessRatingTotalStatistics {
    private Long totalNumberOfRatings;
    private double averagePoint;

    public BusinessRatingTotalStatistics(Number totalNumberOfRatings, Number averagePoint) {
        this.totalNumberOfRatings = totalNumberOfRatings != null ? totalNumberOfRatings.longValue() : 0L;
        this.averagePoint = averagePoint != null ? averagePoint.doubleValue() : 0.0;
    }
}

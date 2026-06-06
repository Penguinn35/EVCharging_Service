package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BusinessRatingResponseDTO {
    private Page<BusinessRatingDTO> ratingResponses;
    private BusinessRatingTotalStatistics totalStatistics; // to get average points and total points
    private List<RatingStatisticDTO> ratingStatistics; // to get total count group by point
}

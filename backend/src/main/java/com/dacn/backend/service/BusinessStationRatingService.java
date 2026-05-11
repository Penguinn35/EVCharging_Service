package com.dacn.backend.service;

import com.dacn.backend.dto.BusinessRatingResponseDTO;
import com.dacn.backend.dto.BusinessRatingTotalStatistics;
import com.dacn.backend.dto.RatingResponseDTO;
import com.dacn.backend.dto.RatingStatisticDTO;
import com.dacn.backend.repository.RatingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BusinessStationRatingService {
    @Autowired
    private RatingRepo ratingRepo;

    public BusinessRatingResponseDTO getRatingWithNoFilter(String companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RatingResponseDTO> ratingResponses = ratingRepo.getRatingOfBusiness(companyId, pageable);
        // Get average point statistics
        BusinessRatingTotalStatistics totalRatingStatistics = ratingRepo.getTotalRatingStatistics(companyId);
        // Get total ratings group by point
        List<RatingStatisticDTO> ratingStatistics = ratingRepo.getBusinessRatingStatistics(companyId);
        return new BusinessRatingResponseDTO(
                ratingResponses, totalRatingStatistics, ratingStatistics
        );
    }

    public BusinessRatingResponseDTO getRatingWithFilter(
            LocalDate fromDate,
            LocalDate toDate,
            int lowestPoint,
            int highestPoint,
            String companyId,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        LocalDateTime startTime = fromDate.atStartOfDay();
        LocalDateTime endTime = toDate.atTime(LocalTime.MAX);
        Page<RatingResponseDTO> ratingResponses = ratingRepo.getRatingOfBusinessWithFilters(
                startTime, endTime, lowestPoint, highestPoint, companyId, pageable
        );
        // Get average point statistics
        BusinessRatingTotalStatistics totalStatistics = ratingRepo.getTotalRatingStatisticsWithFilters(
                startTime, endTime, lowestPoint, highestPoint, companyId
        );
        // Get total ratings group by point
        List<RatingStatisticDTO> ratingStatistics = ratingRepo.getBusinessRatingStatisticsWithFilters(
                startTime, endTime, lowestPoint, highestPoint, companyId
        );
        return new BusinessRatingResponseDTO(
                ratingResponses, totalStatistics, ratingStatistics
        );
    }
}

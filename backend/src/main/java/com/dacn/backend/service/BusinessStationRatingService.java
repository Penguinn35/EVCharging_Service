package com.dacn.backend.service;

import com.dacn.backend.dto.RatingResponseDTO;
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

    public Page<RatingResponseDTO> getRatingWithNoFilter(String companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ratingRepo.getRatingOfBusiness(companyId, pageable);
    }

    public Page<RatingResponseDTO> getRatingWithFilter(
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
        return ratingRepo.getRatingOfBusinessWithFilters(startTime, endTime, lowestPoint, highestPoint, companyId, pageable);
    }
}

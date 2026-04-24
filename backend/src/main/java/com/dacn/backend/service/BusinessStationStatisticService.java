package com.dacn.backend.service;

import com.dacn.backend.dto.StatisticsResponseDTO;
import com.dacn.backend.repository.StationStatisticRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
public class BusinessStationStatisticService {

    @Autowired
    StationStatisticRepo stationStatisticRepo;

    public List<StatisticsResponseDTO> getTotalViewCountByDateRange(LocalDate fromDate, LocalDate toDate, String companyId) {
        String fromDateString = fromDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String toDateString = toDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return stationStatisticRepo.getStatisticsByRangeOfDate(fromDateString, toDateString, companyId);
    }

}

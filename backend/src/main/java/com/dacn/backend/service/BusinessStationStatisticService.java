package com.dacn.backend.service;

import com.dacn.backend.dto.SaveStatisticResponseDTO;
import com.dacn.backend.dto.StatisticsByStationResponseDTO;
import com.dacn.backend.dto.StatisticsResponseDTO;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.repository.ChargingStationRepo;
import com.dacn.backend.repository.StationStatisticRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Service
public class BusinessStationStatisticService {

    @Autowired
    private StationStatisticRepo stationStatisticRepo;
    @Autowired
    private ChargingStationRepo stationRepo;

    public Page<StatisticsResponseDTO> getTotalViewCountByDateRange(LocalDate fromDate, LocalDate toDate, String companyId, int page, int size) {
        String fromDateString = fromDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String toDateString = toDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Pageable pageable = PageRequest.of(page, size);
        return stationStatisticRepo.getStatisticsByRangeOfDate(fromDateString, toDateString, companyId, pageable);
    }

    public Page<StatisticsByStationResponseDTO> getTotalViewCountByStationId(
            String stationId, LocalDate fromDate, LocalDate toDate, String companyId, int page, int size
    ) {
        ChargingStation station = stationRepo.findById(stationId).orElse(null);
        if (station == null || !Objects.equals(station.getCpo().getEnterpriseId(), companyId)) {
            return null;
        }

        String fromDateString = fromDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String toDateString = toDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return stationStatisticRepo.getTotalViewCountOfAStation(
                stationId, fromDateString, toDateString, PageRequest.of(page, size)
        );
    }

    public SaveStatisticResponseDTO getSaveStationStatisticByStationId(String stationId, String companyId) {
        return stationRepo.getSaveStationCountByStationId(stationId, companyId);
    }

    public Page<SaveStatisticResponseDTO> getSaveStationStatistic(String companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return stationRepo.getSaveStationCount(companyId, pageable);
    }
}

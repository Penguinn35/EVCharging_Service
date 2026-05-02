package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class StatisticsByStationResponseDTO {
    private String stationId;
    private String stationName;
    private Long sumOfViewDetailCount;
    private String date;

    public StatisticsByStationResponseDTO(String stationId, String stationName, Object sumOfViewDetailCount, String date) {
        this.stationId = stationId;
        this.stationName = stationName;
        this.date = date;

        if (sumOfViewDetailCount instanceof Number) {
            this.sumOfViewDetailCount = ((Number) sumOfViewDetailCount).longValue();
        } else {
            this.sumOfViewDetailCount = 0L;
        }
    }
}

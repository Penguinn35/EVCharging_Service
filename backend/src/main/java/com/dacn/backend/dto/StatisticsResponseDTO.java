package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class StatisticsResponseDTO {
    private String stationId;
    private String stationName;
    private String address;
    private Long sumOfViewDetailCount;

    public StatisticsResponseDTO(String stationId, String address, String stationName, Object sumOfViewDetailCount) {
        this.stationId = stationId;
        this.stationName = stationName;
        this.address = address;

        if (sumOfViewDetailCount instanceof Number) {
            this.sumOfViewDetailCount = ((Number) sumOfViewDetailCount).longValue();
        } else {
            this.sumOfViewDetailCount = 0L;
        }
    }
}

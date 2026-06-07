package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;

@Data
//@AllArgsConstructor
@NoArgsConstructor
public class HitfullResponseDTO {
    private String stationId;
    private String stationName;
    private String address;
    private Long hitfullCount;
    private LocalDate date;

    public HitfullResponseDTO(String stationId, String stationName, String address, Long hitfullCount, Object date) {
        this.stationId = stationId;
        this.stationName = stationName;
        this.hitfullCount = hitfullCount;
        this.address = address;
        if (date instanceof java.sql.Date) {
            this.date = ((Date) date).toLocalDate();
        } else {
            this.date = (LocalDate) date;
        }
    }
}

package com.dacn.backend.dto;

import lombok.Data;

@Data
public class HitfullGeneralDTO {
    private CoordinateDTO location;
    private Long hitfullCount;

    public HitfullGeneralDTO(Double longitude, Double latitude, Long hitfullCount) {
        this.location = new CoordinateDTO(longitude, latitude);
        this.hitfullCount = hitfullCount;
    }
}

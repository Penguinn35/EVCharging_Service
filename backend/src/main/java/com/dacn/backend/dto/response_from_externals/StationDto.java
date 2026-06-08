package com.dacn.backend.dto.response_from_externals;

import java.util.List;

public record StationDto(
        String id,
        String name,
        PositionDto position,
        String address,
        String district,
        Integer status,
        List<ChargingPointDto> chargingPoints
) {}

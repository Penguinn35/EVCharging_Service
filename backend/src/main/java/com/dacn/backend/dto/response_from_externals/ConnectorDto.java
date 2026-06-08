package com.dacn.backend.dto.response_from_externals;

public record ConnectorDto(
        String id,
        Integer type,
        Long price,
        Integer voltage,
        Integer maxPower,
        Boolean isAvailable
) {}

package com.dacn.backend.dto.response_from_externals;

import java.util.List;

public record ChargingPointDto(
        String id,
        Integer status,
        List<ConnectorDto> connectors
) {}

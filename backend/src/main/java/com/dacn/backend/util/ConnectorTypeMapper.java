package com.dacn.backend.util;

import com.dacn.backend.constants.ConnectorType;
import com.dacn.backend.exception.InvalidStationCommandException;

public final class ConnectorTypeMapper {

    private ConnectorTypeMapper() {
    }

    public static int toCode(String type) {
        if (type == null || type.isBlank()) {
            throw new InvalidStationCommandException("Connector type is required");
        }
        String normalized = type.trim().toUpperCase()
                .replace(' ', '_')
                .replace("TYPE2", "TYPE_2");
        try {
            return ConnectorType.valueOf(normalized).ordinal();
        } catch (IllegalArgumentException e) {
            throw new InvalidStationCommandException(
                    "Invalid connector type: " + type + ". Use CCS2, TYPE_2, CHAdeMO, or TESLA"
            );
        }
    }
}

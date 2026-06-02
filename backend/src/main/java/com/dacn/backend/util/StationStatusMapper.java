package com.dacn.backend.util;

import com.dacn.backend.constants.StationStatus;
import com.dacn.backend.exception.InvalidStationCommandException;

public final class StationStatusMapper {

    private StationStatusMapper() {
    }

    public static int toCode(String status) {
        if (status == null || status.isBlank()) {
            return StationStatus.AVAILABLE.getCode();
        }
        try {
            return StationStatus.valueOf(status.trim().toUpperCase()).getCode();
        } catch (IllegalArgumentException e) {
            throw new InvalidStationCommandException(
                    "Invalid station status: " + status + ". Use AVAILABLE, BUSY, UNAVAILABLE, or FULL"
            );
        }
    }
}

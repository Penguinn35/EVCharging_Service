package com.dacn.backend.constants;

import lombok.Getter;

@Getter
public enum StationStatus {
    UNAVAILABLE(0), AVAILABLE(1), BUSY(2), FULL(3);

    private final int code;

    StationStatus(int code) {
        this.code = code;
    }

}

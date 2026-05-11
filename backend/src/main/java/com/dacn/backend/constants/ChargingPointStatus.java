package com.dacn.backend.constants;

public enum ChargingPointStatus {
    OFFLINE(0),
    AVAILABLE(1),
    MAINTENANCE(2),
    IN_USE(3);

    private final int code;

    ChargingPointStatus(int code) {
        this.code = code;
    }
}

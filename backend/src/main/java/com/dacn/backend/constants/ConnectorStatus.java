package com.dacn.backend.constants;

public enum ConnectorStatus {
    OFFLINE(0),
    AVAILABLE(1),
    MAINTENANCE(2),
    IN_USE(3);

    private final int code;

    ConnectorStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static ConnectorStatus fromCode(int code) {
        for (ConnectorStatus status : values()) {
            if (status.code == code) {
                return status;
            }
        }
        return OFFLINE; // Giá trị mặc định nếu có lỗi
    }
}

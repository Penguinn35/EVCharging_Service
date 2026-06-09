package com.dacn.backend.dto;

import com.dacn.backend.constants.ConnectorStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
//@AllArgsConstructor
@NoArgsConstructor
public class ConnectorDTO {
    private String id;
    private int type;
    private Double price;
    private Double voltage;
    private Double maxPower;
    private boolean isAvailable;
    private ConnectorStatus status;
    private String chargingPointId;

    public ConnectorDTO(String id, int type, Double price, Double voltage, Double maxPower,
                        boolean isAvailable, int status, String chargingPointId) {
        this.id = id;
        this.type = type;
        this.price = price;
        this.voltage = voltage;
        this.maxPower = maxPower;
        this.isAvailable = isAvailable;
        this.status = ConnectorStatus.fromCode(status);
        this.chargingPointId = chargingPointId;
    }
}

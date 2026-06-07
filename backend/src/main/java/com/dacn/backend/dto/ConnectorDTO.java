package com.dacn.backend.dto;

import com.dacn.backend.constants.ConnectorStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConnectorDTO {
    private String id;
    private int type;
    private Double price;
    private Double voltage;
    private Double maxPower;
    private boolean isAvailable;
    private ConnectorStatus status;
}

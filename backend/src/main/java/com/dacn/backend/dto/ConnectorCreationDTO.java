package com.dacn.backend.dto;

import lombok.Data;

@Data
public class ConnectorCreationDTO {
    private String id;
    private int type;
    private Double price;
    private Double voltage;
    private Double maxPower;
    private boolean isAvailable;
}

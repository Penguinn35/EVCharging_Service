package com.dacn.backend.dto.command;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConnectorCreatePayload {
    private String id;
    private String chargingPointId;
    private String stationExternalId;
    /** CCS2 | TYPE_2 | CHAdeMO | TESLA */
    private String type;
    private Double powerKw;
    private Double price;
    private Double voltage;
    private Boolean isAvailable;
}

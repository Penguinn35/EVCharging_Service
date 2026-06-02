package com.dacn.backend.dto.command;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StationUpdatedPayload {
    private String externalId;
    private String name;
    private Double latitude;
    private Double longitude;
    private String address;
    private String district;
    /** AVAILABLE | BUSY | UNAVAILABLE | FULL */
    private String status;
}

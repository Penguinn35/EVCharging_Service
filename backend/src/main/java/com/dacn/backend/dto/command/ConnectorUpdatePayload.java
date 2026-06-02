package com.dacn.backend.dto.command;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConnectorUpdatePayload {
    private String id;
    private String type;
    private Double powerKw;
    private Double price;
    private Double voltage;
    private Boolean isAvailable;
}

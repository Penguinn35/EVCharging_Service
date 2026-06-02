package com.dacn.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class StationCommandRequest {
    @JsonProperty("event_type")
    private StationCommandType eventType;

    @JsonProperty("new_station")
    private StationCreationDTO newStation;

    private StationUpdateRequestDTO station;

    private String id;
}

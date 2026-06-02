package com.dacn.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StationCommandResponseDTO {
    @JsonProperty("event_type")
    private StationCommandType eventType;

    private Boolean success;

    @JsonProperty("new_station")
    private StationCreationDTO createdStation;

    private StationUpdateRequestDTO station;

    private String id;
}

package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;
import lombok.Data;

@Data
public class SuggestionRequestDTO {
    private Coordinate location;
    private String description;
}

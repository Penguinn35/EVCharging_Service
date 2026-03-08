package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;

import lombok.Data;

@Data
public class UserStationCategoriesRequestDTO {
    private String chargeCableType;
    private Coordinate position;
}

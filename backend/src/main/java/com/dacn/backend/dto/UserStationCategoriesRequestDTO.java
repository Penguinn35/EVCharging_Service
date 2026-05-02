package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStationCategoriesRequestDTO {
    private int chargeCableType;
    private Coordinate position;
}

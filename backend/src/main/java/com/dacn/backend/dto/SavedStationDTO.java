package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavedStationDTO {
    private String id;
    private String name;
    private String address;
    private Coordinate position;
}

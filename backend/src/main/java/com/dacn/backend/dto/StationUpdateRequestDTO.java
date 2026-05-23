package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StationUpdateRequestDTO {
    private String id;
    private String name;
    private Coordinate position;
    private String address;
    private String district;
}

package com.dacn.backend.dto;

import com.dacn.backend.model.type.Coordinate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationBusinessSearchDTO {
    private String id;
    private String name;
    private String address;
    private int status;
}

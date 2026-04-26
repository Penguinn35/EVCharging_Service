package com.dacn.backend.dto;

import lombok.Data;

@Data
public class SaveStatisticResponseDTO {
    private String id;
    private String name;
    private String address;
    private Long numberOfSaves;

    public SaveStatisticResponseDTO(String id, String name, String address, Object numberOfSaves) {
        this.id = id;
        this.name = name;
        this.address = address;

        if (numberOfSaves instanceof Long) {
            this.numberOfSaves = (Long) numberOfSaves;
        }
    }
}

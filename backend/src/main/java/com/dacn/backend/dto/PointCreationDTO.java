package com.dacn.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PointCreationDTO {
    private String id;
    private int status;

    List<ConnectorCreationDTO> connectors;
}

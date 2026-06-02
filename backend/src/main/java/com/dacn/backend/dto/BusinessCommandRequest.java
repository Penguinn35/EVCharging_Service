package com.dacn.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class BusinessCommandRequest {
    private BusinessEventType eventType;
    private JsonNode payload;
}

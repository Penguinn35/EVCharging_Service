package com.dacn.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BusinessCommandResponseDTO {
    private BusinessEventType eventType;
    private Boolean success;
    private Object result;
}

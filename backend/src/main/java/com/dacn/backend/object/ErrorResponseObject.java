package com.dacn.backend.object;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ErrorResponseObject {
    private HttpStatus status;
    private String message;
}

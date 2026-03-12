package com.dacn.backend.object;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ResponseObject<T> {
    private T responseData;
    private String message;
}

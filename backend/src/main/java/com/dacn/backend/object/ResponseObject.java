package com.dacn.backend.object;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ResponseObject<T> {
    private HttpStatus httpStatus;
    private String message;
    private T responseData;

    public ResponseObject(HttpStatus status, String msg) {
        this.httpStatus = status;
        this.message = msg;
        responseData = null;
    }
}

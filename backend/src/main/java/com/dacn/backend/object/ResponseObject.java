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
    private long objectCount;

    public ResponseObject(HttpStatus status, String msg) {
        this.httpStatus = status;
        this.message = msg;
        responseData = null;
        this.objectCount = 0;
    }

    public ResponseObject(HttpStatus status, String msg, T object) {
        this.httpStatus = status;
        this.message = msg;
        this.responseData = object;
        this.objectCount = 1;
    }
}

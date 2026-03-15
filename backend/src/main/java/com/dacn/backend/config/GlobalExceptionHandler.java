package com.dacn.backend.config;

import com.dacn.backend.object.ErrorResponseObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SQLException.class)
    public ResponseEntity<ErrorResponseObject> handleSQLException(SQLException e) {
        ErrorResponseObject errorResponseObject = new ErrorResponseObject(
                HttpStatus.BAD_REQUEST,
                "Error from database: " + e.getMessage()
        );
        return new ResponseEntity<>(errorResponseObject, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseObject> handleSystemError(RuntimeException e) {
        ErrorResponseObject errorResponseObject = new ErrorResponseObject(
                HttpStatus.BAD_REQUEST,
                "Error from database: " + e.getMessage()
        );
        return new ResponseEntity<>(errorResponseObject, HttpStatus.BAD_REQUEST);
    }
}

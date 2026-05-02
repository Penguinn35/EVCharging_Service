package com.dacn.backend.config;

import com.dacn.backend.object.ErrorResponseObject;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SQLException.class)
    public ResponseEntity<ErrorResponseObject> handleSQLException(SQLException e) {
        ErrorResponseObject errorResponseObject = new ErrorResponseObject(
                HttpStatus.BAD_REQUEST,
                "Error from database: " + e.getMessage() + ". Root cause: " + e.getCause()
        );
        return new ResponseEntity<>(errorResponseObject, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseObject> handleSystemError(RuntimeException e) {
        ErrorResponseObject errorResponseObject = new ErrorResponseObject(
                HttpStatus.BAD_REQUEST,
                "Runtime Error caught with message: " + e.getMessage() + ". Root cause: " + e.getClass()
        );
        e.printStackTrace();
        return new ResponseEntity<>(errorResponseObject, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponseObject> handleJwtExpiredError(ExpiredJwtException e) {
        ErrorResponseObject errorResponseObject = new ErrorResponseObject(
                HttpStatus.FORBIDDEN,
                "Jwt Expired. Message: " + e.getMessage()
        );
        return new ResponseEntity<>(errorResponseObject, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseObject> handleJsonError(HttpMessageNotReadableException e) {
        Throwable cause = e.getCause();
        String message;
        if (cause instanceof InvalidFormatException invalidFormatException) {
            String fieldName = "unknown";
            if (!invalidFormatException.getPath().isEmpty()) {
                fieldName = invalidFormatException.getPath().getFirst().getFieldName();
            }

            Object invalidValue = invalidFormatException.getValue();
            message = "Invalid data type at " + fieldName + ". Received value: \"" + invalidValue + "\"";
        } else {
            message = "Invalid input format, please check again";
        }

        return new ResponseEntity<>(
                new ErrorResponseObject(
                        HttpStatus.BAD_REQUEST,
                        "Your input json is not in the correct format. Message: " + message),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseObject> handleDataIntegrityError(DataIntegrityViolationException e) {
//        log.error(e.getMessage());
        String message;
        if (e.getMessage().contains("duplicate")) {
            int startIndex = e.getMessage().indexOf("Key") + 5;
            int endIndex = e.getMessage().indexOf(')', startIndex);
            String variable = e.getMessage().substring(startIndex, endIndex);
            message = String.format("The %s value already existed", variable);
        } else if (e.getMessage().contains("is not present")) {
            // get the attribute that throw exception
            int startIndex = e.getMessage().indexOf("Key") + 5;
            int endIndex = e.getMessage().indexOf(')', startIndex);
            String variable = e.getMessage().substring(startIndex, endIndex);
            message = String.format("The %s value does not exist in the database", variable);
        } else {
            message = e.getCause().getMessage();
        }

        return new ResponseEntity<>(
                new ErrorResponseObject(
                        HttpStatus.BAD_REQUEST,
                        "Your input json has some problems. Message: " + message),
                HttpStatus.BAD_REQUEST
        );
    }
}

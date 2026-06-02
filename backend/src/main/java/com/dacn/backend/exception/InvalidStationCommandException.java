package com.dacn.backend.exception;

public class InvalidStationCommandException extends RuntimeException {
    public InvalidStationCommandException(String message) {
        super(message);
    }
}

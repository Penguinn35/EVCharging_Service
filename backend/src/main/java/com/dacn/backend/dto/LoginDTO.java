package com.dacn.backend.dto;

import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
public class LoginDTO {
    String username;
    String password;
}

package com.dacn.backend.dto;

import lombok.Data;

@Data
public class UserRegisterDTO {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String address;
}

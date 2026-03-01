package com.dacn.backend.dto;

import lombok.Data;

@Data
public class UserRegisterDTO {
    String username;
    String password;
    String email;
    String fullName;
}

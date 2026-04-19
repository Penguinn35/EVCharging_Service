package com.dacn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CPORegisterDTO {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String address;
    private String companyId;
    private String companyName;
    private String logoUrl;
    private String taxCode;
    private String companyAddress;
}

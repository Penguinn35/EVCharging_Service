package com.dacn.backend.dto;

import lombok.Data;

@Data
public class BusinessUpdateProfileDTO {
    private String companyName;
    private String companyAddress;
    private String taxCode;
    private String managerFullName;
    private String managerEmail;
    private String managerAddress;
    private String serverUrl;
    private String token;
}

package com.dacn.backend.dto;

import lombok.Data;

@Data
public class BusinessProfileDTO {
    private String companyName;
    private String companyAddress;
    private String taxCode;
    private String logoUrl;
    private String managerFullName;
    private String managerEmail;
    private String managerAddress;
}

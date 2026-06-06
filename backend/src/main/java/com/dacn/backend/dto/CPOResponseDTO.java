package com.dacn.backend.dto;

import lombok.Data;

@Data
public class CPOResponseDTO {
    private String companyId;
    private String companyName;
    private String companyAddress;
    private String taxCode;
    private String logoUrl;
    private Boolean isVerified;
    private String managerFullName;
    private String managerEmail;
    private String managerAddress;
}

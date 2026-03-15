package com.dacn.backend.model;

import org.springframework.stereotype.Component;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class EnterpriseProfile {
    @Id
    private String enterpriseId;
    private String companyName;
    private String taxCode;
    private String address;

}

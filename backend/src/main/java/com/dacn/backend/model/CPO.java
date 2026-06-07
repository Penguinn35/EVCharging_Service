package com.dacn.backend.model;

import jakarta.persistence.*;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class CPO {
    @Id
    private String enterpriseId;
    @Column(unique = true, nullable = false)
    private String companyName;
    private String logoUrl;
    private String taxCode;
    private String address;
    private Boolean isVerified;
    private String serverUrl;
    private String token;

    @OneToMany(mappedBy = "cpo", cascade = CascadeType.ALL)
    private List<ChargingStation> managingStations;

    @OneToOne
    @JoinColumn(name = "manager_id")
    private EVUser manager;

}

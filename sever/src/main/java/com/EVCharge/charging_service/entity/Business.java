package com.EVCharge.charging_service.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long businessId;

    private String name;
    private String contactInfo;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    private List<ChargingStation> stations;

    // getters and setters
}

package com.EVCharge.charging_service.entity;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class ChargingStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stationId;

    private String name;
    private String address;
    private double latitude;
    private double longitude;

    @ManyToOne
    @JoinColumn(name = "business_id")
    private Business business;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    @JsonManagedReference  
    private List<ChargePoint> chargePoints;

    // getters and setters
}

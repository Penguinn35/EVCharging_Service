package com.EVCharge.charging_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
@Entity
public class ChargePoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private int power;
    private String status;

    @ManyToOne
    @JoinColumn(name = "station_id")
    @JsonBackReference 
    private ChargingStation station;

    // ✅ Add getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public int getPower() { return power; }
    public void setPower(int power) { this.power = power; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public ChargingStation getStation() { return station; }
    public void setStation(ChargingStation station) { this.station = station; }
}

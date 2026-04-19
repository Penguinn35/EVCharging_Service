package com.dacn.backend.model;

import java.util.List;

import jakarta.persistence.*;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class ChargingPoint {
    @Id 
    private String id;
    private int status;
    @ManyToOne
    @JoinColumn(name = "charging_station_id")
    private ChargingStation chargingStation;

    @OneToMany(mappedBy = "chargingPoint", cascade = CascadeType.ALL)
    private List<Connector> connectors;
}

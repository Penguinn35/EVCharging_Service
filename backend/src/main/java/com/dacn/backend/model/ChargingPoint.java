package com.dacn.backend.model;

import java.util.List;

import org.springframework.stereotype.Component;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
    private String status;
    @ManyToOne
    @JoinColumn(name = "charging_station_id")
    private ChargingStation chargingStation;

    @OneToMany(mappedBy = "chargingPoint")
    private List<Connector> connectors;
}

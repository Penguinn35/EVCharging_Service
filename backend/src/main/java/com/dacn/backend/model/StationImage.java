package com.dacn.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StationImage {
    @Id
    private String key;
    private String url;
    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private ChargingStation station;
}

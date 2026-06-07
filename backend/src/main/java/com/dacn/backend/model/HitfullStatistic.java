package com.dacn.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HitfullStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private LocalDate date;
    private Long hitfullCount;

    @ManyToOne
    @JoinColumn(name = "charging_station_id", nullable = false)
    private ChargingStation station;
}

package com.dacn.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class StationStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String date;
    private Long viewDetailCount;
    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private ChargingStation station;
}

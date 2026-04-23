package com.dacn.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    private String date;
    private Long viewDetailCount;
    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private ChargingStation station;
}

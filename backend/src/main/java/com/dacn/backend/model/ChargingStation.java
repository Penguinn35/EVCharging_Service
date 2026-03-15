package com.dacn.backend.model;

import java.util.List;

import org.springframework.stereotype.Component;

import com.dacn.backend.model.type.Coordinate;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class ChargingStation {
    @Id
    private String id;
    private String name;
    private String manufacturer;
    private Coordinate position;
    private String address;
    private String district;
    private Long totalPoints;
    private String status;
    @OneToMany(mappedBy = "chargingStation")
    private List<ChargingPoint> chargingPoints;

    @OneToMany(mappedBy = "station")
    private List<Rating> ratings;
}

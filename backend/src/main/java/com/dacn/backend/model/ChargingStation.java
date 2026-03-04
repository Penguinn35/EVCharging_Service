package com.dacn.backend.model;

import org.springframework.stereotype.Component;

import com.dacn.backend.model.type.Coordinate;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
    String id;
    String name;
    String manufacturer;
    Coordinate position;
    String address;
    String district;
    Long totalPoints;
    String status;
}

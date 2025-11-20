package com.dacn.backend.model;

import org.springframework.stereotype.Component;

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
    Double longitude;
    Double latitude;
    String locationName;
    Long totalPoints;
    String status;
}

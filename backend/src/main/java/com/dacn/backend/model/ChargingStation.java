package com.dacn.backend.model;

import java.util.List;

import jakarta.persistence.*;
import org.springframework.stereotype.Component;

import com.dacn.backend.model.type.Coordinate;

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
    private String imageUrl;
    private Coordinate position;
    private String address;
    private String district;
    private Long totalPoints;
    private int status;
    @OneToMany(mappedBy = "chargingStation", cascade = CascadeType.ALL)
    private List<ChargingPoint> chargingPoints;

    @OneToMany(mappedBy = "station")
    private List<Rating> ratings;

    @OneToMany(mappedBy = "station")
    private List<UserSavesStation> savingUsers;

    @ManyToOne
    @JoinColumn(name = "manufacturer_id")
    private CPO cpo;
}

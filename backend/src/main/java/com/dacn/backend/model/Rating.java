package com.dacn.backend.model;

import jakarta.persistence.*;
import org.springframework.stereotype.Component;

import lombok.Data;

import java.util.Date;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(name = "uniqueUserAndStation", columnNames = {"station_id", "user_id"})
})
@Data
@Component
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private Double point; // on a scale from 1 to 5
    private Date datePosted;
    private String comment;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private ChargingStation station;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private EVUser user;
}

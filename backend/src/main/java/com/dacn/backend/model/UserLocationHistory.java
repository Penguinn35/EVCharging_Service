package com.dacn.backend.model;

import com.dacn.backend.model.type.Coordinate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLocationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private Coordinate location;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private EVUser user;
}

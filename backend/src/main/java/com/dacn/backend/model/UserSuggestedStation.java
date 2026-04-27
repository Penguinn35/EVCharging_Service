package com.dacn.backend.model;

import com.dacn.backend.model.type.Coordinate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSuggestedStation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private Coordinate location;
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private EVUser user;
}

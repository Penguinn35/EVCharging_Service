package com.dacn.backend.model;

import com.dacn.backend.model.composite_key.UserSavesStationKey;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class UserSavesStation {
    @EmbeddedId
    private UserSavesStationKey userSavesStationKey;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private EVUser eVUser;

    @ManyToOne
    @MapsId("stationId")
    @JoinColumn(name = "station_id")
    private ChargingStation station;
}

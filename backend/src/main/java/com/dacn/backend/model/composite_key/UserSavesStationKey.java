package com.dacn.backend.model.composite_key;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class UserSavesStationKey {
    @Column(name = "user_id")
    private String userId;
    @Column(name = "station_id")
    private String stationId;
}

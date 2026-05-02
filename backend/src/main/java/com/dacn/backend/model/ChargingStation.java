package com.dacn.backend.model;

import java.util.List;

import com.dacn.backend.constants.StationStatus;
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
public class ChargingStation {
    @Id
    private String id;
    private String name;
//    private String imageUrl;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    private List<StationImage> images;

    private Coordinate position;
    private String address;
    private String district;
    private int status;
    private Long numberOfSaves;
    private Long hitFullCount;
    private Long capacity;
    private Long currentVehicleCount;

    @OneToMany(mappedBy = "chargingStation", cascade = CascadeType.ALL)
    private List<ChargingPoint> chargingPoints;

    @OneToMany(mappedBy = "station")
    private List<Rating> ratings;

    @OneToMany(mappedBy = "station")
    private List<UserSavesStation> savingUsers;

    @ManyToOne
    @JoinColumn(name = "manufacturer_id")
    private CPO cpo;

    @OneToMany(mappedBy = "station", cascade = CascadeType.ALL)
    private List<StationStatistic> statistics;

    @PreUpdate
    public void incrementHitFullCount() {
        if (this.status == StationStatus.FULL.getCode()) {
            this.hitFullCount = (this.hitFullCount == null ? 0 : this.hitFullCount) + 1;
        }
    }

    public void updateVehicleCount(Long newCount) {
        this.currentVehicleCount = newCount;

        if (this.capacity != null && this.capacity > 0) {
            double usageRatio = (double) this.currentVehicleCount / this.capacity;

            if (usageRatio >= 0.9) {
                this.status = StationStatus.FULL.getCode();
            } else {
                // Đổi lại thành trạng thái bình thường (ví dụ: AVAILABLE) nếu dưới 90%
                this.status = StationStatus.AVAILABLE.getCode();
            }
        }
    }
}

package com.dacn.backend.repository;

import java.util.List;

import com.dacn.backend.dto.ConnectorDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dacn.backend.model.ChargingPoint;

@Repository
public interface ChargingPointRepo extends JpaRepository<ChargingPoint, String> {
    @Query("SELECT p FROM ChargingPoint p JOIN p.connectors c WHERE c.type = :cableType")
    public List<ChargingPoint> findByCableType(@Param("cableType") String cableType);

    @Query(value = """
        SELECT c.id, c.type, c.price, c.voltage, c.max_power, c.is_available, c.status
        FROM charging_point p JOIN connector c ON p.id = c.charging_point_id
        WHERE p.charging_station_id = :stationId
""", nativeQuery = true)
    public List<ConnectorDTO> getConnectorsFromChargingPointWithStationId(@Param("stationId") String stationId);
}

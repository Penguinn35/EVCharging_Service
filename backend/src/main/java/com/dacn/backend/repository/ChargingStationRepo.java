package com.dacn.backend.repository;

import java.util.List;

import com.dacn.backend.dto.search_by_keyword.StationSearchResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;
import com.dacn.backend.model.ChargingStation;

@Repository
public interface ChargingStationRepo extends JpaRepository<ChargingStation, String> {    
    // @Query("SELECT s.id, s.name FROM ChargingStation s WHERE s.name LIKE :keyword OR s.address LIKE :keyword")
    // public List<StationResponseDTO> findByKeyword(String keyword, int limit);

    @Query(
        value = """
                SELECT id, name
                FROM charging_station s
                WHERE LOWER(unaccent(s.name)) LIKE ?1 OR LOWER(unaccent(s.address)) LIKE ?1
                                   OR LOWER(unaccent(s.district)) LIKE ?1
                ORDER BY s.name ASC
                LIMIT ?2
                """,
        nativeQuery = true
    )
    List<StationSearchResponseDTO> findByKeyword(String keyword, int limit);

    @Query(value = """
        SELECT * FROM (
            SELECT
                s.id,
                s.name,
                -- Tính khoảng cách chính xác bằng Haversine (đơn vị: mét)
                (6371000 * acos(
                    cos(radians(:latitude)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(:longitude)) +
                    sin(radians(:latitude)) * sin(radians(s.latitude))
                )) / 1000 AS distance
            FROM charging_station s
            -- BƯỚC 1: LỌC THÔ bằng Bounding Box (~5km = 0.045 độ)
            WHERE s.latitude BETWEEN (:latitude - 0.045) AND (:latitude + 0.045)
              AND s.longitude BETWEEN (:longitude - 0.045) AND (:longitude + 0.045)
        ) AS station_distances
        -- BƯỚC 2: LỌC TINH (Chỉ lấy trong vòng bán kính 5000m)
        WHERE distance <= 5000
        ORDER BY distance
        LIMIT 5
        """, nativeQuery = true)
    List<StationResponseDTO> findByLongitudeAndLatitude(@Param("longitude") Double longitude, @Param("latitude") Double latitude);

    @Query(value = """
            SELECT s.id, s.name, (6371000 * acos(
                    cos(radians(:latitude)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(:longitude)) +
                    sin(radians(:latitude)) * sin(radians(s.latitude))
                )) / 1000 AS distance
            FROM charging_station s, charging_point p, connector c
            WHERE p.charging_station_id = s.id AND c.charging_point_id = p.id
                AND c.type = :cableType
                AND p.status = 'AVAILABLE'
            ORDER BY SQRT(POWER(:longitude - s.longitude, 2) + POWER(:latitude - s.latitude, 2))
            LIMIT 1
            """, nativeQuery = true)
    StationResponseDTO findByCableType(
        @Param("cableType") String cableType, 
        @Param("longitude") Double longitude, 
        @Param ("latitude") Double latitude
    );
} 

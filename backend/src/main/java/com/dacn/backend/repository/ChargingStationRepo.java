package com.dacn.backend.repository;

import java.util.List;

import com.dacn.backend.dto.*;
import com.dacn.backend.dto.search_by_keyword.StationSearchResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
            SELECT s.id, s.name, s.address || ', ' || s.district
            FROM charging_station s
            WHERE (:keyword IS NULL OR 
                   LOWER(unaccent(s.name)) LIKE :keyword OR 
                   LOWER(unaccent(s.address)) LIKE :keyword OR 
                   LOWER(unaccent(s.district)) LIKE :keyword OR 
                   LOWER(unaccent(CAST(s.id AS TEXT))) LIKE :keyword)
              AND (:district IS NULL OR s.district = :district)
              AND s.status > 0
            ORDER BY s.name ASC
            LIMIT :limit
            """,
            nativeQuery = true
    )
    List<StationSearchResponseDTO> findByKeywordAndDistrict(
            @Param("keyword") String keyword,
            @Param("district") String district,
            @Param("limit") int limit
    );

//    @Query(nativeQuery = true, value = """
//                SELECT id, name, address || ', ' || district
//                FROM charging_station s
//                WHERE s.district = :district
//""")
//    List<StationSearchResponseDTO> findByDistrict(String district);

    @Query(value = """
        SELECT * FROM (
            SELECT
                s.id,
                s.name,
                o.company_name as manufacturer,
                -- Tính khoảng cách chính xác bằng Haversine (đơn vị: mét)
                (6371000 * acos(
                    cos(radians(:latitude)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(:longitude)) +
                    sin(radians(:latitude)) * sin(radians(s.latitude))
                )) / 1000 AS distance,
                s.longitude, s.latitude, s.status
            FROM charging_station s JOIN cpo o ON s.manufacturer_id = o.enterprise_id
            -- BƯỚC 1: LỌC THÔ bằng Bounding Box (~5km = 0.045 độ)
            WHERE s.status > 0 AND (s.latitude BETWEEN (:latitude - 0.045) AND (:latitude + 0.045)
              AND s.longitude BETWEEN (:longitude - 0.045) AND (:longitude + 0.045))
        ) AS station_distances
        -- BƯỚC 2: LỌC TINH (Chỉ lấy trong vòng bán kính 5000m)
        WHERE distance <= 5
        ORDER BY distance
        """, nativeQuery = true)
    List<StationByLocationResponseDTO> findByLongitudeAndLatitude(@Param("longitude") Double longitude, @Param("latitude") Double latitude);

    @Query(value = """
            SELECT s.id, s.name, o.company_name as manufacturer, s.address || ', ' || s.district AS address, 
                               s.longitude, s.latitude, 
                               (ST_Distance(
                                                   ST_MakePoint(s.longitude, s.latitude)::geography,
                                                   ST_MakePoint(:longitude, :latitude)::geography
                                               ) / 1000.0) AS distance
            FROM charging_station s JOIN cpo o ON o.enterprise_id = s.manufacturer_id
                        JOIN charging_point p ON p.charging_station_id = s.id
                        JOIN connector c ON c.charging_point_id = p.id
            WHERE c.type = :cableType
                AND p.status > 0
            ORDER BY ST_MakePoint(s.longitude, s.latitude)::geography <-> ST_MakePoint(:longitude, :latitude)::geography
            LIMIT 1
            """, nativeQuery = true)
    StationResponseDTO findByCableType(
        @Param("cableType") int cableType,
        @Param("longitude") Double longitude, 
        @Param ("latitude") Double latitude
    );

//    @Query(value = """
//            SELECT source FROM ways
//            ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
//            LIMIT 1
//""", nativeQuery = true)
//    Long findNearestNode(@Param("longitude") Double longitude, @Param("latitude") Double latitude);
//
//    @Query(value = """
//        SELECT ST_AsGeoJson(ST_Union(w.the_geom))
//        FROM
//        	pgr_Dijkstra('select gid as id, source, target, cost, reverse_cost from ways',
//        	:startNode, :endNode, true) AS d
//        	JOIN ways w ON d.edge = w.gid;
//""", nativeQuery = true)
//    String getRouteAsGeoJson(@Param("startNode") Long startNode, @Param("endNode") Long endNode);

    @Query(value = """
        SELECT s.longitude, s.latitude
        FROM charging_station s
        WHERE id = :stationId
        LIMIT 1
""", nativeQuery = true)
    CoordinateDTO findPositionOfStation(@Param("stationId") String stationId);

    @Query(nativeQuery = true, value = """
    WITH start_node AS (
        SELECT source AS id FROM hcmc_map_2po_4pgr
        ORDER BY geom_way <-> ST_SetSRID(ST_MakePoint(:startLon, :startLat), 4326)
        LIMIT 1
    ),
    end_node AS (
        SELECT target AS id FROM hcmc_map_2po_4pgr
        ORDER BY geom_way <-> ST_SetSRID(ST_MakePoint(:endLon, :endLat), 4326)
        LIMIT 1
    ),
    route AS (
        SELECT * FROM pgr_aStar(
            'SELECT id, source, target, cost, reverse_cost, x1, y1, x2, y2 FROM hcmc_map_2po_4pgr',
            (SELECT id FROM start_node),
            (SELECT id FROM end_node),
            directed := true
        )
    )
    SELECT ST_AsGeoJSON(ST_Union(w.geom_way))
    FROM route r
    JOIN hcmc_map_2po_4pgr w ON r.edge = w.id
    WHERE r.edge != -1
    """)
    String findOptimalRouteGeoJSON(
            @Param("startLon") double startLon,
            @Param("startLat") double startLat,
            @Param("endLon") double endLon,
            @Param("endLat") double endLat
    );

    @Query(nativeQuery = true, value = """
        SELECT s.id, s.name, s.address || ', ' || s.district AS address, s.status, COUNT(p.id) AS numberOfChargingPoints
                FROM charging_station s LEFT JOIN charging_point p ON s.id = p.charging_station_id
                WHERE (LOWER(unaccent(s.name)) LIKE :keyword OR LOWER(unaccent(s.address || ' ' || s.district)) LIKE :keyword
                                   OR LOWER(unaccent(s.id)) LIKE :keyword) AND (:district IS NULL OR s.district = :district)
                                    AND s.manufacturer_id = :manufacturerId
                GROUP BY s.id, s.name, s.address || ', ' || s.district, s.status
                ORDER BY s.name ASC
""", countQuery = """
            SELECT count(*)
            FROM charging_station s
            WHERE (LOWER(unaccent(s.name)) LIKE :keyword OR LOWER(unaccent(s.address || ' ' || s.district)) LIKE :keyword
                                   OR LOWER(unaccent(s.id)) LIKE :keyword) AND (:district IS NULL OR s.district = :district)
                                    AND s.manufacturer_id = :manufacturerId
            """)
    Page<StationBusinessSearchDTO> findBusinessStation(
            @Param("keyword") String keyword,
            @Param("district") String district,
            @Param("manufacturerId") String manufacturerId,
            Pageable pageable
    );

    @Query(nativeQuery = true, value = """
        SELECT s.id, s.name, s.address || ', ' || s.district AS address, s.status, COUNT(p.id) AS numberOfChargingPoints
                FROM charging_station s LEFT JOIN charging_point p ON s.id = p.charging_station_id
                WHERE s.manufacturer_id = :manufacturerId AND (:district IS NULL OR s.district = :district)
                GROUP BY s.id, s.name, s.address || ', ' || s.district, s.status
                ORDER BY s.name ASC
""", countQuery = """
            SELECT count(*)
            FROM charging_station s
            WHERE s.manufacturer_id = :manufacturerId AND (:district IS NULL OR s.district = :district)
            """)
    Page<StationBusinessSearchDTO> findBusinessStationWithoutKeyword(
            @Param("district") String district,
            @Param("manufacturerId") String manufacturerId,
            Pageable pageable
    );

//    @Query(value = """
//        UPDATE charging_station
//        SET image_url = ?1
//        WHERE id = ?2
//""", nativeQuery = true)
//    @Modifying
//    void updateImageUrl(String imageUrl, String stationId);

    @Modifying
    @Query(value = """
UPDATE ChargingStation s
SET s.numberOfSaves = s.numberOfSaves + 1
WHERE s.id = :stationId
""")
    void incrementSaveCount(String stationId);

    @Query(nativeQuery = true, value = """
SELECT s.id, s.name, s.address, s.number_of_saves
FROM charging_station s
WHERE s.id = :stationId AND s.manufacturer_id = :companyId
""")
    SaveStatisticResponseDTO getSaveStationCountByStationId(String stationId, String companyId);

    @Query(nativeQuery = true, value = """
SELECT s.id, s.name, s.address, s.number_of_saves
FROM charging_station s
WHERE s.manufacturer_id = :companyId
ORDER BY s.number_of_saves DESC
""", countQuery = """
            SELECT count(s.id)
            FROM charging_station s
            WHERE s.manufacturer_id = :companyId
            """)
    Page<SaveStatisticResponseDTO> getSaveStationCount(String companyId, Pageable pageable);

    @Modifying
    @Query(nativeQuery = true, value = """
UPDATE charging_station s
SET current_vehicle_count = :currentCount
WHERE s.id = :stationId
""")
    void updateCurrentVehicleCount(@Param("currentCount") Long currentCount, @Param("stationId") String stationId);

    @Query(nativeQuery = true, value = """
SELECT DISTINCT(district)
FROM charging_station
""")
    List<String> getAllDistricts();

    @Query(nativeQuery = true, value = """
SELECT id, hit_full_count
FROM charging_station
WHERE manufacturer_id = :companyId
""")
    List<HitfullResponseDTO> getAllHitfull(String companyId);
}

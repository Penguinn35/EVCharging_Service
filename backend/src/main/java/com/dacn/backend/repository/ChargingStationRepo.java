package com.dacn.backend.repository;

import java.util.List;

import com.dacn.backend.dto.CoordinateDTO;
import com.dacn.backend.dto.SaveStatisticResponseDTO;
import com.dacn.backend.dto.StationBusinessSearchDTO;
import com.dacn.backend.dto.StationByLocationResponseDTO;
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
                SELECT id, name, address || ', ' || district
                FROM charging_station s
                WHERE (LOWER(unaccent(s.name)) LIKE ?1 OR LOWER(unaccent(s.address)) LIKE ?1
                                   OR LOWER(unaccent(s.district)) LIKE ?1 OR LOWER(unaccent(s.id)) LIKE ?1)
                                    AND s.status > 0
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
            SELECT s.id, s.name, o.company_name as manufacturer, s.address, s.longitude, s.latitude, (6371000 * acos(
                    cos(radians(:latitude)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(:longitude)) +
                    sin(radians(:latitude)) * sin(radians(s.latitude))
                )) / 1000 AS distance
            FROM charging_station s JOIN cpo o ON o.enterprise_id = s.manufacturer_id, charging_point p, connector c
            WHERE p.charging_station_id = s.id AND c.charging_point_id = p.id
                AND c.type = :cableType
                AND p.status > 0
            ORDER BY SQRT(POWER(:longitude - s.longitude, 2) + POWER(:latitude - s.latitude, 2))
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
        WITH start_nodes AS (
            SELECT source AS id FROM ways
            ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(:startLon, :startLat), 4326)
            LIMIT 10
        ),
        end_nodes AS (
            SELECT target AS id FROM ways 
            ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint(:endLon, :endLat), 4326) 
            LIMIT 10
        ),
        -- pgr_dijkstra nhận vào array và tính toán tất cả tổ hợp
        routes AS (
            SELECT * FROM pgr_dijkstra(
                'SELECT gid AS id, source, target, length_m AS cost, reverse_cost FROM ways',
                (SELECT array_agg(id)::bigint[] FROM start_nodes),
                (SELECT array_agg(id)::bigint[] FROM end_nodes),
                directed := true
            )
        ),
        -- Tìm cặp (start_vid, end_vid) có tổng chi phí (agg_cost) thấp nhất
        best_pair AS (
            SELECT start_vid, end_vid 
            FROM routes 
            WHERE edge = -1 
            ORDER BY start_vid ASC 
            LIMIT 1
        )
        -- Trích xuất hình học của con đường chiến thắng
        SELECT ST_AsGeoJSON(ST_Union(w.the_geom))
        FROM routes r
        JOIN best_pair bp ON r.start_vid = bp.start_vid AND r.end_vid = bp.end_vid
        JOIN ways w ON r.edge = w.gid
        WHERE r.edge != -1
        """)
    String findOptimalRouteGeoJSON(
            @Param("startLon") double startLon,
            @Param("startLat") double startLat,
            @Param("endLon") double endLon,
            @Param("endLat") double endLat
    );

    @Query(nativeQuery = true, value = """
        SELECT id, name, address || ', ' || district AS address, status
                FROM charging_station s
                WHERE (LOWER(unaccent(s.name)) LIKE ?1 OR LOWER(unaccent(s.address)) LIKE ?1
                                   OR LOWER(unaccent(s.district)) LIKE ?1 OR LOWER(unaccent(s.id)) LIKE ?1)
                                    AND s.manufacturer_id = ?2
                ORDER BY s.name ASC
""", countQuery = """
            SELECT count(*)
            FROM charging_station s
            WHERE (LOWER(unaccent(s.name)) LIKE ?1 OR LOWER(unaccent(s.address)) LIKE ?1
                                   OR LOWER(unaccent(s.district)) LIKE ?1 OR LOWER(unaccent(s.id)) LIKE ?1)
                                    AND s.manufacturer_id != ?2
            """)
    Page<StationBusinessSearchDTO> findBusinessStation(String keyword, String manufacturerId, Pageable pageable);

    @Query(nativeQuery = true, value = """
        SELECT id, name, address || ', ' || district AS address, status
                FROM charging_station s
                WHERE s.manufacturer_id = ?1
                ORDER BY s.name ASC
""", countQuery = """
            SELECT count(*)
            FROM charging_station s
            WHERE s.manufacturer_id = ?1
            """)
    Page<StationBusinessSearchDTO> findBusinessStationWithoutKeyword(String manufacturerId, Pageable pageable);

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
    List<SaveStatisticResponseDTO> getSaveStationCountByStationId(String stationId, String companyId);

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
}

package com.dacn.backend.repository;

import java.util.List;

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
                ORDER BY s.name
                LIMIT ?2
                """,
        nativeQuery = true
    )
    public List<StationResponseDTO> findByKeyword(String keyword, int limit);

    @Query(value = """
            SELECT id, name
            FROM charging_station s
            WHERE SQRT(POWER(:longitude - s.longitude, 2) + POWER(:latitude - s.latitude, 2)) < 0.045
            LIMIT 5
            """, nativeQuery = true)
    public List<StationResponseDTO> findByLongitudeAndLatitude(@Param("longitude") Double longitude, @Param ("latitude") Double latitude);
} 

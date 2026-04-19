package com.dacn.backend.repository;

import com.dacn.backend.dto.RatingResponseDTO;
import com.dacn.backend.dto.RatingStatisticDTO;
import com.dacn.backend.model.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepo extends JpaRepository<Rating, String> {
    @Query(value = """
        SELECT r.id, r.comment, r.point
        FROM rating r
        WHERE r.station_id = ?1
""", countQuery = """
    SELECT count(r.id)
    FROM rating r
    WHERE r.station_id = ?1
""", nativeQuery = true)
    Page<RatingResponseDTO> findByStation(String stationId, Pageable pageable);

    @Query(value = """
        SELECT r.point AS starPoint, count(r.point) AS totalNumberOfRatings
        FROM rating r
        WHERE r.station_id = :stationId
        GROUP BY r.point
""", nativeQuery = true)
    List<RatingStatisticDTO> getStatistic(@Param("stationId") String stationId);

//    @Query(nativeQuery = true, value = """
//        INSERT INTO
//""")
}

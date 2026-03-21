package com.dacn.backend.repository;

import com.dacn.backend.dto.RatingResponseDTO;
import com.dacn.backend.model.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface RatingRepo extends JpaRepository<Rating, String> {
    @Query(value = """
        SELECT r.id, r.comment
        FROM rating r
        WHERE r.station_id = ?1
""", countQuery = """
    SELECT count(r.id)
    FROM rating r 
    WHERE r.station_id = ?1
""", nativeQuery = true)
    Page<RatingResponseDTO> findByStation(String stationId, Pageable pageable);
}

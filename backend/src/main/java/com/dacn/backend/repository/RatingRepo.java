package com.dacn.backend.repository;

import com.dacn.backend.dto.BusinessRatingDTO;
import com.dacn.backend.dto.BusinessRatingTotalStatistics;
import com.dacn.backend.dto.RatingResponseDTO;
import com.dacn.backend.dto.RatingStatisticDTO;
import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.model.EVUser;
import com.dacn.backend.model.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepo extends JpaRepository<Rating, String> {
    @Query(value = """
    SELECT new com.dacn.backend.dto.RatingResponseDTO(r.id, r.comment, r.point, r.datePosted)
    FROM Rating r
    WHERE r.station.id = ?1
""")
    Page<RatingResponseDTO> findByStationId(String stationId, Pageable pageable);

    @Query(value = """
        SELECT r.point AS starPoint, count(r.point) AS totalNumberOfRatings
        FROM rating r
        WHERE r.station_id = :stationId
        GROUP BY r.point
""", nativeQuery = true)
    List<RatingStatisticDTO> getStatistic(@Param("stationId") String stationId);

    @Query(nativeQuery = true, value = """
SELECT cs.name, r.comment, r.point, r.date_posted
FROM rating r JOIN charging_station cs ON r.station_id = cs.id
WHERE cs.manufacturer_id = :companyId
""", countQuery = """
            SELECT count(*)
            FROM rating r JOIN charging_station cs ON r.station_id = cs.id
            WHERE cs.manufacturer_id = :companyId
            """)
    Page<BusinessRatingDTO> getRatingOfBusiness(String companyId, Pageable pageable);

    @Query(nativeQuery = true, value = """
SELECT count(*), sum(r.point) / count(*)
FROM rating r JOIN charging_station cs ON r.station_id = cs.id
WHERE cs.manufacturer_id = :companyId
""")
    BusinessRatingTotalStatistics getTotalRatingStatistics(String companyId);

    @Query(nativeQuery = true, value = """
SELECT r.point, count(r.point)
FROM rating r JOIN charging_station cs ON r.station_id = cs.id
WHERE cs.manufacturer_id = :companyId
GROUP BY r.point
""")
    List<RatingStatisticDTO> getBusinessRatingStatistics(String companyId); // to get total ratings group by point

    @Query(nativeQuery = true, value = """
SELECT cs.name, r.comment, r.point, r.date_posted
FROM rating r JOIN charging_station cs ON r.station_id = cs.id
WHERE cs.manufacturer_id = :companyId AND r.point >= :lowestPoint AND r.point <= :highestPoint
    AND r.date_posted >= :fromDate AND r.date_posted <= :toDate
""", countQuery = """
            SELECT *
            FROM rating r JOIN charging_station cs ON r.station_id = cs.id
            WHERE cs.manufacturer_id = :companyId AND r.point = :ratingPoint AND r.date_posted >= :fromDate
                AND r.date_posted <= :toDate
            """)
    Page<BusinessRatingDTO> getRatingOfBusinessWithFilters(LocalDateTime fromDate, LocalDateTime toDate,
                                                           int lowestPoint, int highestPoint,
                                                           String companyId, Pageable pageable);

    @Query(nativeQuery = true, value = """
SELECT count(*), sum(r.point) / count(*)
FROM rating r JOIN charging_station cs ON r.station_id = cs.id
WHERE cs.manufacturer_id = :companyId AND r.point >= :lowestPoint AND r.point <= :highestPoint
    AND r.date_posted >= :fromDate AND r.date_posted <= :toDate
""")
    BusinessRatingTotalStatistics getTotalRatingStatisticsWithFilters(LocalDateTime fromDate, LocalDateTime toDate,
                                                                      int lowestPoint, int highestPoint,
                                                                      String companyId);

    @Query(nativeQuery = true, value = """
SELECT r.point, count(r.point)
FROM rating r JOIN charging_station cs ON r.station_id = cs.id
WHERE cs.manufacturer_id = :companyId AND r.point >= :lowestPoint AND r.point <= :highestPoint
    AND r.date_posted >= :fromDate AND r.date_posted <= :toDate
GROUP BY r.point
""")
    List<RatingStatisticDTO> getBusinessRatingStatisticsWithFilters(LocalDateTime fromDate, LocalDateTime toDate,
                                                                    int lowestPoint, int highestPoint,
                                                                    String companyId);

    Optional<Rating> findByUserAndStation(EVUser user, ChargingStation station);
}

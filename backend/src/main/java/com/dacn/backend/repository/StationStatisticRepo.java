package com.dacn.backend.repository;

import com.dacn.backend.dto.StatisticsByStationResponseDTO;
import com.dacn.backend.dto.StatisticsResponseDTO;
import com.dacn.backend.model.StationStatistic;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationStatisticRepo extends JpaRepository<StationStatistic, String> {
    @Modifying
    @Transactional
    @Query("UPDATE StationStatistic s SET s.viewDetailCount = s.viewDetailCount + 1 " +
            "WHERE s.date = :date AND s.station.id = :stationId")
    int incrementViewCount(String date, String stationId);

    @Query(nativeQuery = true, value = """
SELECT cs.id AS stationId, cs.name AS stationName, cs.address AS address,
       COALESCE(SUM(st.view_detail_count), 0) AS sumOfViewDetailCount
FROM charging_station cs
    LEFT JOIN station_statistic st ON cs.id = st.station_id
        AND st.date >= :fromDate AND st.date <= :toDate
    JOIN cpo c ON cs.manufacturer_id = c.enterprise_id
WHERE c.enterprise_id = :companyId
GROUP BY cs.id, cs.name, cs.address
ORDER BY sumOfViewDetailCount DESC
""", countQuery = """
            SELECT COUNT(*)
            FROM charging_station cs
            JOIN cpo c ON cs.manufacturer_id = c.enterprise_id
            WHERE c.enterprise_id = :companyId
            """)
    Page<StatisticsResponseDTO> getStatisticsByRangeOfDate(String fromDate, String toDate, String companyId, Pageable pageable);

    @Query(nativeQuery = true, value = """
SELECT st.station_id AS stationId, cs.name AS stationName, st.view_detail_count AS sumOfViewDetailCount, st.date
FROM charging_station cs 
    JOIN station_statistic st ON cs.id = st.station_id
WHERE st.station_id = :stationId AND st.date >= :fromDate AND st.date <= :toDate 
""", countQuery = """
            SELECT count(*)
            FROM charging_station cs 
                JOIN station_statistic st ON cs.id = st.station_id
            WHERE st.station_id = :stationId AND st.date >= :fromDate AND st.date <= :toDate 
            """)
    Page<StatisticsByStationResponseDTO> getTotalViewCountOfAStation(String stationId, String fromDate, String toDate, Pageable pageable);
}

package com.dacn.backend.repository;

import com.dacn.backend.dto.StatisticsByStationResponseDTO;
import com.dacn.backend.dto.StatisticsResponseDTO;
import com.dacn.backend.model.StationStatistic;
import jakarta.transaction.Transactional;
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
SELECT st.station_id AS stationId, cs.name AS stationName, SUM(st.view_detail_count) AS sumOfViewDetailCount
FROM charging_station cs 
    JOIN station_statistic st ON cs.id = st.station_id
    JOIN cpo c ON cs.manufacturer_id = c.enterprise_id
WHERE c.enterprise_id = :companyId AND st.date >= :fromDate AND st.date <= :toDate
GROUP BY st.station_id, cs.name
""")
    List<StatisticsResponseDTO> getStatisticsByRangeOfDate(String fromDate, String toDate, String companyId);

    @Query(nativeQuery = true, value = """
SELECT st.station_id AS stationId, cs.name AS stationName, st.view_detail_count AS sumOfViewDetailCount, st.date
FROM charging_station cs 
    JOIN station_statistic st ON cs.id = st.station_id
WHERE st.station_id = :stationId AND st.date >= :fromDate AND st.date <= :toDate 
""")
    List<StatisticsByStationResponseDTO> getTotalViewCountOfAStation(String stationId, String fromDate, String toDate);
}

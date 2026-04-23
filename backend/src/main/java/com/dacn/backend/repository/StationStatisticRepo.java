package com.dacn.backend.repository;

import com.dacn.backend.model.StationStatistic;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StationStatisticRepo extends JpaRepository<StationStatistic, String> {
    @Modifying
    @Transactional
    @Query("UPDATE StationStatistic s SET s.viewDetailCount = s.viewDetailCount + 1 " +
            "WHERE s.date = :date AND s.station.id = :stationId")
    int incrementViewCount(String date, String stationId);
}

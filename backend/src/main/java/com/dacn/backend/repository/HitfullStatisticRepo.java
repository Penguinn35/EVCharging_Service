package com.dacn.backend.repository;

import com.dacn.backend.dto.HitfullGeneralDTO;
import com.dacn.backend.dto.HitfullResponseDTO;
import com.dacn.backend.model.HitfullStatistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HitfullStatisticRepo extends JpaRepository<HitfullStatistic, String> {

    @Query(nativeQuery = true, value = """
SELECT s.id, s.name, s.address || ', ' || s.district AS address, s.longitude, s.latitude, hs.hitfull_count, hs.date
FROM hitfull_statistic hs JOIN charging_station s ON hs.charging_station_id = s.id
WHERE s.manufacturer_id = :companyId AND ST_DWithin(
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
    :radius
) AND hs.date >= :fromDate AND hs.date <= :toDate
""")
    List<HitfullResponseDTO> getAllHitfull(String companyId, @Param("longitude") Double longitude,
                                           @Param("latitude") Double latitude,
                                           @Param("radius") Double radius,
                                           @Param("fromDate") LocalDate fromDate,
                                           @Param("toDate") LocalDate toDate);

    @Query(nativeQuery = true, value = """
SELECT s.longitude, s.latitude, hs.hitfull_count
FROM hitfull_statistic hs JOIN charging_station s ON hs.charging_station_id = s.id
WHERE s.manufacturer_id = :companyId AND hs.date >= :fromDate AND hs.date <= :toDate
""")
    List<HitfullGeneralDTO> getHitfullGeneral(String companyId, @Param("fromDate") LocalDate fromDate,
                                              @Param("toDate") LocalDate toDate);
}

package com.dacn.backend.repository;

import com.dacn.backend.dto.SavedStationDTO;
import com.dacn.backend.model.UserSavesStation;
import com.dacn.backend.model.composite_key.UserSavesStationKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSavesStationRepo extends JpaRepository<UserSavesStation, UserSavesStationKey> {

    @Query(value = """
SELECT NEW com.dacn.backend.dto.SavedStationDTO(s.id, s.name, s.address, s.position)
FROM UserSavesStation uss JOIN uss.station s
WHERE uss.userSavesStationKey.userId = :userId
""")
    List<SavedStationDTO> getSavedStationOfUser(@Param("userId") String userId);

    @Query(value = """
INSERT INTO user_saves_station (user_id, station_id)
VALUES (:userId, :stationId)
""", nativeQuery = true)
    @Modifying
    void saveStationForUser(@Param("userId") String userId, @Param("stationId") String stationId);

    @Query(value = """
DELETE FROM user_saves_station
WHERE station_id = :stationId AND user_id = :userId
""", nativeQuery = true)
    @Modifying
    void deleteUserSavesStationByStationIdAndUserId(@Param("userId") String userId, @Param("stationId") String stationId);
}

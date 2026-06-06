package com.dacn.backend.repository;

import com.dacn.backend.dto.CoordinateDTO;
import com.dacn.backend.dto.UserSuggestedStationDTO;
import com.dacn.backend.model.UserSuggestedStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSuggestionRepo extends JpaRepository<UserSuggestedStation, String> {
    @Query(value = """
SELECT longitude, latitude, timestamp, description
FROM user_suggested_station
WHERE ST_DWithin(
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
    ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
    :radius
)
""", nativeQuery = true)
    List<UserSuggestedStationDTO> getSuggestions(@Param("longitude") Double longitude,
                                                 @Param("latitude") Double latitude,
                                                 @Param("radius") Double radius);
}

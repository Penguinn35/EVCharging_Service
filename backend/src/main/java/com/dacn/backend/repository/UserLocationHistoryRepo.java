package com.dacn.backend.repository;

import com.dacn.backend.dto.CoordinateDTO;
import com.dacn.backend.model.UserLocationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLocationHistoryRepo extends JpaRepository<UserLocationHistory, String> {
    @Query(nativeQuery = true, value = """
SELECT longitude, latitude
FROM user_location_history
""")
    List<CoordinateDTO> getLocations();
}

package com.dacn.backend.repository;

import com.dacn.backend.dto.CoordinateDTO;
import com.dacn.backend.dto.UserLocationHistoryDTO;
import com.dacn.backend.model.UserLocationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserLocationHistoryRepo extends JpaRepository<UserLocationHistory, String> {
    @Query(nativeQuery = true, value = """
SELECT u.longitude, u.latitude, u.timestamp
FROM user_location_history u
WHERE u.timestamp >= fromDate AND u.timestamp <= toDate
""")
    List<UserLocationHistoryDTO> getLocations(LocalDate fromDate, LocalDate toDate);
}

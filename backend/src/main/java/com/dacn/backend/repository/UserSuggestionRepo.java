package com.dacn.backend.repository;

import com.dacn.backend.dto.CoordinateDTO;
import com.dacn.backend.model.UserSuggestedStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSuggestionRepo extends JpaRepository<UserSuggestedStation, String> {
    @Query(value = """
SELECT longitude, latitude
FROM user_suggested_station
""", nativeQuery = true)
    List<CoordinateDTO> getSuggestions();
}

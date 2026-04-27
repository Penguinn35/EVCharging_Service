package com.dacn.backend.repository;

import com.dacn.backend.model.UserSuggestedStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSuggestionRepo extends JpaRepository<UserSuggestedStation, String> {
}

package com.dacn.backend.repository;

import com.dacn.backend.dto.UserResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dacn.backend.model.EVUser;
import java.util.Optional;

@Repository
public interface EVUserRepo extends JpaRepository<EVUser, String> {
    Optional<EVUser> findByUsername(String username);
    @Query("SELECT u.id FROM EVUser u WHERE u.username = ?1")
    UserResponseDTO findIdByUsername(String username);
}

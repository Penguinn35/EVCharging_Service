package com.dacn.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dacn.backend.model.EVUser;
import java.util.Optional;

@Repository
public interface EVUserRepo extends JpaRepository<EVUser, String> {
    Optional<EVUser> findByUsername(String username);
}

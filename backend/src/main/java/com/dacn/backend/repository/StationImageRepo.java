package com.dacn.backend.repository;

import com.dacn.backend.model.StationImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StationImageRepo extends JpaRepository<StationImage, String> {
}

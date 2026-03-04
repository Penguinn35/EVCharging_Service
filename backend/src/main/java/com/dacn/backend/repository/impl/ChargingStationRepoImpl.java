package com.dacn.backend.repository.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ChargingStationRepoImpl {
    @PersistenceContext
    private EntityManager entityManager;

    public List<StationResponseDTO> findByKeyword(String keyword, int limit) {
        return entityManager.createQuery("SELECT s.id, s.name FROM ChargingStation s WHERE s.name LIKE :keyword OR s.address LIKE :keyword", StationResponseDTO.class)
            .setParameter("keyword", keyword)    
            .setMaxResults(limit).getResultList();
    }
}

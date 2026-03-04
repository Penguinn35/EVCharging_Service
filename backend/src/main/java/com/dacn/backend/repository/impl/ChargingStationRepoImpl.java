package com.dacn.backend.repository.impl;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Repository;

import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ChargingStationRepoImpl {
    @PersistenceContext
    private EntityManager entityManager;

    private String deAccent(String str) {
        String nfdNormalizedString = Normalizer.normalize(str, Normalizer.Form.NFD); 
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfdNormalizedString).replaceAll("");
    }

    public List<StationResponseDTO> findByKeyword(String keyword, int limit) {
        return entityManager.createQuery("SELECT s.id, s.name FROM ChargingStation s WHERE LOWER(s.name) LIKE LOWER(:keyword) OR s.address LIKE LOWER(:keyword)", StationResponseDTO.class)
            .setParameter("keyword", keyword)    
            .setMaxResults(limit).getResultList();
    }
}

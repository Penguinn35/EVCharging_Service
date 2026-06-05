package com.dacn.backend.repository;

import com.dacn.backend.dto.LogoResponseDTO;
import com.dacn.backend.model.CPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CPORepo extends JpaRepository<CPO, String> {
    @Query(nativeQuery = true,
    value = """
SELECT company_name, logo_url
FROM cpo
WHERE company_name in :companyNames
""")
    List<LogoResponseDTO> findByCompanyName(@Param("companyNames") List<String> companyNames);

    @Query(nativeQuery = true, value = """
SELECT company_name, logo_url
FROM cpo
""")
    List<LogoResponseDTO> findAllLogos();

    @Query(nativeQuery = true, value = """
UPDATE cpo
SET is_verified = TRUE
WHERE enterprise_id = :enterpriseId
""")
    @Modifying
    int verifyCPO(String enterpriseId);
}

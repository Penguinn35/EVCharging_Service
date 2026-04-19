package com.dacn.backend.repository;

import com.dacn.backend.model.CPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CPORepo extends JpaRepository<CPO, String> {

}

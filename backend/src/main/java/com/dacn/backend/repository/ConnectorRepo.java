package com.dacn.backend.repository;

import com.dacn.backend.model.Connector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectorRepo extends JpaRepository<Connector, String> {
}

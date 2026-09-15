package com.GigGo.repository;

import com.GigGo.entity.cooperative.LabourCooperative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LabourCooperativeRepository extends JpaRepository<LabourCooperative, UUID> {

    Optional<LabourCooperative> findByRegistrationNumber(String registrationNumber);

    boolean existsByRegistrationNumber(String registrationNumber);

    List<LabourCooperative> findAllByIsActiveTrue();

    List<LabourCooperative> findAllByRegionIgnoreCaseAndIsActiveTrue(String region);
}

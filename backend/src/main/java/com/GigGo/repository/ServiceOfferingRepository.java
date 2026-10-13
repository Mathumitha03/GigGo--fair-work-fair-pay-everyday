package com.GigGo.repository;

import com.GigGo.entity.service.ServiceOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, UUID> {

    List<ServiceOffering> findByWorkerIdAndIsActiveTrue(UUID workerId);

    boolean existsByWorkerIdAndCategoryIdAndIsActiveTrue(UUID workerId, UUID categoryId);
}

package com.GigGo.repository;

import com.GigGo.entity.service.ServiceProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServiceProblemRepository extends JpaRepository<ServiceProblem, UUID> {

    List<ServiceProblem> findByCategoryIdAndIsActiveTrue(UUID categoryId);

    List<ServiceProblem> findByCategoryId(UUID categoryId);

    Optional<ServiceProblem> findByIdAndCategoryId(UUID problemId, UUID categoryId);
}

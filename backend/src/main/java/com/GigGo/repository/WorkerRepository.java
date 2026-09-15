package com.GigGo.repository;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.AffiliationStatus;
import com.GigGo.enums.WorkerVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, UUID> {

    Optional<Worker> findByUser(User user);

    Optional<Worker> findByUserId(UUID userId);

    List<Worker> findAllByPrimaryCooperative(LabourCooperative cooperative);

    List<Worker> findAllByAffiliationStatus(AffiliationStatus affiliationStatus);

    List<Worker> findAllByVerificationStatus(WorkerVerificationStatus verificationStatus);

    @Query("SELECT w FROM Worker w WHERE w.affiliationStatus = 'AFFILIATED' AND w.isAvailable = true AND w.primaryCooperative.id = :cooperativeId")
    List<Worker> findAvailableAffiliatedWorkersByCooperative(@Param("cooperativeId") UUID cooperativeId);

    @Query("SELECT w FROM Worker w WHERE w.affiliationStatus = 'AFFILIATED' AND w.isAvailable = true")
    List<Worker> findAllAvailableAffiliatedWorkers();
}

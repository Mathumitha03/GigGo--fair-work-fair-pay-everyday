package com.GigGo.repository;

import com.GigGo.entity.booking.WorkerAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkerAvailabilityRepository extends JpaRepository<WorkerAvailability, UUID> {

    Optional<WorkerAvailability> findByWorkerIdAndAvailableDate(UUID workerId, LocalDate availableDate);
}

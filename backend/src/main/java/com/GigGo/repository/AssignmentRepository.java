package com.GigGo.repository;

import com.GigGo.entity.booking.Assignment;
import com.GigGo.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {

    List<Assignment> findByBookingId(UUID bookingId);

    List<Assignment> findByWorkerIdOrderByAssignedAtDesc(UUID workerId);

    List<Assignment> findByWorkerIdAndStatusOrderByAssignedAtDesc(UUID workerId, AssignmentStatus status);

    Optional<Assignment> findFirstByBookingIdAndStatusOrderByAssignedAtDesc(UUID bookingId, AssignmentStatus status);

    @Query("SELECT a FROM Assignment a WHERE a.status = :status AND a.assignedAt < :cutoff")
    List<Assignment> findExpiredAssignments(@Param("status") AssignmentStatus status, @Param("cutoff") Instant cutoff);

    @Query("SELECT a FROM Assignment a WHERE a.status = :status AND ((a.expiresAt IS NOT NULL AND a.expiresAt <= :now) OR (a.expiresAt IS NULL AND a.assignedAt < :cutoff))")
    List<Assignment> findExpiredAssignmentsWithNow(@Param("status") AssignmentStatus status, @Param("cutoff") Instant cutoff, @Param("now") Instant now);

    boolean existsByBookingIdAndWorkerId(UUID bookingId, UUID workerId);

    boolean existsByWorkerIdAndStatus(UUID workerId, AssignmentStatus status);

    List<Assignment> findByBookingIdAndStatus(UUID bookingId, AssignmentStatus status);

    Optional<Assignment> findFirstByBookingIdAndWorkerIdAndStatus(UUID bookingId, UUID workerId, AssignmentStatus status);

    @Query("SELECT a FROM Assignment a WHERE a.worker.id = :workerId AND a.status = :status AND a.booking.serviceProblem.id = :problemId ORDER BY a.assignedAt DESC")
    List<Assignment> findByWorkerIdAndStatusAndProblemId(@Param("workerId") UUID workerId, @Param("status") AssignmentStatus status, @Param("problemId") UUID problemId);
}

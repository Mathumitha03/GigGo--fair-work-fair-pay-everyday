package com.GigGo.repository;

import com.GigGo.entity.cooperative.CooperativeWorkerId;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CooperativeWorkerIdRepository extends JpaRepository<CooperativeWorkerId, UUID> {

    Optional<CooperativeWorkerId> findByWorkerId(String workerId);

    boolean existsByWorkerId(String workerId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM CooperativeWorkerId c WHERE c.workerId = :workerId")
    Optional<CooperativeWorkerId> findByWorkerIdForUpdate(@Param("workerId") String workerId);
}

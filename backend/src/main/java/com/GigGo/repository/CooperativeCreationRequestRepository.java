package com.GigGo.repository;

import com.GigGo.entity.cooperative.CooperativeCreationRequest;
import com.GigGo.enums.CooperativeRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CooperativeCreationRequestRepository extends JpaRepository<CooperativeCreationRequest, UUID> {

    List<CooperativeCreationRequest> findAllByWorkerId(UUID workerId);

    List<CooperativeCreationRequest> findAllByStatus(CooperativeRequestStatus status);

    List<CooperativeCreationRequest> findAllByWorkerIdAndStatus(UUID workerId, CooperativeRequestStatus status);
}

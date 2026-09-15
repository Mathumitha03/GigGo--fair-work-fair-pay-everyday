package com.GigGo.repository;

import com.GigGo.entity.cooperative.CooperativeMembership;
import com.GigGo.enums.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CooperativeMembershipRepository extends JpaRepository<CooperativeMembership, UUID> {

    List<CooperativeMembership> findAllByWorkerId(UUID workerId);

    List<CooperativeMembership> findAllByCooperativeId(UUID cooperativeId);

    List<CooperativeMembership> findAllByCooperativeIdAndStatus(UUID cooperativeId, MembershipStatus status);

    Optional<CooperativeMembership> findByWorkerIdAndStatus(UUID workerId, MembershipStatus status);

    Optional<CooperativeMembership> findByWorkerIdAndCooperativeId(UUID workerId, UUID cooperativeId);

    boolean existsByWorkerIdAndCooperativeIdAndStatus(UUID workerId, UUID cooperativeId, MembershipStatus status);
}

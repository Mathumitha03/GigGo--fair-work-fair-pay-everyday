package com.GigGo.repository;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.CooperativeManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CooperativeManagerRepository extends JpaRepository<CooperativeManager, UUID> {

    Optional<CooperativeManager> findByUser(User user);

    Optional<CooperativeManager> findByUserId(UUID userId);

    List<CooperativeManager> findAllByCooperative(LabourCooperative cooperative);

    Optional<CooperativeManager> findFirstByCooperativeId(UUID cooperativeId);
}

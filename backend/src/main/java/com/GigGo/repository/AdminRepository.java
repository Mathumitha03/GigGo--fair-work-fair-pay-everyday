package com.GigGo.repository;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.profile.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {

    Optional<Admin> findByUser(User user);

    Optional<Admin> findByUserId(UUID userId);
}

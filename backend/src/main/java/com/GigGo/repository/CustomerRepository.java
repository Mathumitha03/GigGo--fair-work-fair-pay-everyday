package com.GigGo.repository;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.profile.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Optional<Customer> findByUser(User user);

    Optional<Customer> findByUserId(UUID userId);
}

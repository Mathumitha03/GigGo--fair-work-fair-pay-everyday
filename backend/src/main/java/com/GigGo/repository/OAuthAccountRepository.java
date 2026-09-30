package com.GigGo.repository;

import com.GigGo.entity.authentication.OAuthAccount;
import com.GigGo.entity.authentication.User;
import com.GigGo.enums.OAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, UUID> {

    Optional<OAuthAccount> findByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);

    Optional<OAuthAccount> findByProviderAndEmail(OAuthProvider provider, String email);

    List<OAuthAccount> findAllByUser(User user);

    boolean existsByProviderAndProviderUserId(OAuthProvider provider, String providerUserId);
}

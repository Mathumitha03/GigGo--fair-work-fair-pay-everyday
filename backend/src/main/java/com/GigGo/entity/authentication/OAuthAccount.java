package com.GigGo.entity.authentication;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.enums.OAuthProvider;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "oauth_accounts",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_oauth_provider_user", columnNames = {"provider", "provider_user_id"})
    },
    indexes = {
        @Index(name = "idx_oauth_user_id", columnList = "user_id"),
        @Index(name = "idx_oauth_provider_uid", columnList = "provider, provider_user_id")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = "user")
public class OAuthAccount extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 30)
    private OAuthProvider provider;

    @NotBlank
    @Size(max = 255)
    @Column(name = "provider_user_id", nullable = false, length = 255)
    private String providerUserId;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "avatar_url")
    private String avatarUrl;
}

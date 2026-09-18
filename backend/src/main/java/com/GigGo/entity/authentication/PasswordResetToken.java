package com.GigGo.entity.authentication;

import com.GigGo.entity.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;

@Entity
@Table(
    name = "password_reset_tokens",
    indexes = {
        @Index(name = "idx_pwd_reset_token", columnList = "token", unique = true),
        @Index(name = "idx_pwd_reset_user", columnList = "user_id")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = "user")
public class PasswordResetToken extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(name = "token", nullable = false, unique = true, length = 255)
    private String token;

    @Column(name = "otp", length = 10)
    private String otp;

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Builder.Default
    @Column(name = "is_used", nullable = false)
    private boolean isUsed = false;

    @Column(name = "used_at")
    private Instant usedAt;
}

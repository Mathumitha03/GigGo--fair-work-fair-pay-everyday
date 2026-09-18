package com.GigGo.entity.administration;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.common.BaseEntity;
import com.GigGo.enums.ModerationTargetType;
import com.GigGo.enums.ModerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "moderation_actions",
    indexes = {
        @Index(name = "idx_mod_actions_moderator", columnList = "moderator_id"),
        @Index(name = "idx_mod_actions_target", columnList = "target_type, target_id"),
        @Index(name = "idx_mod_actions_type", columnList = "action_type")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = "moderator")
public class ModerationAction extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moderator_id", nullable = false)
    private User moderator;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, length = 50)
    private ModerationTargetType targetType;

    @NotNull
    @Column(name = "target_id", nullable = false)
    private UUID targetId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false, length = 50)
    private ModerationType actionType;

    @NotBlank
    @Size(max = 255)
    @Column(name = "reason", nullable = false, length = 255)
    private String reason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "expires_at")
    private Instant expiresAt;
}

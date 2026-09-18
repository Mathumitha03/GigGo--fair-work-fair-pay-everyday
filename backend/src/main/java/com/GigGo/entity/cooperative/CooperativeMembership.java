package com.GigGo.entity.cooperative;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.profile.CooperativeManager;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.MembershipStatus;
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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
    name = "cooperative_memberships",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_membership_worker_coop", columnNames = {"worker_id", "cooperative_id"})
    },
    indexes = {
        @Index(name = "idx_memberships_worker", columnList = "worker_id"),
        @Index(name = "idx_memberships_coop", columnList = "cooperative_id"),
        @Index(name = "idx_memberships_status", columnList = "status")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"worker", "cooperative", "verifiedBy"})
public class CooperativeMembership extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooperative_id", nullable = false)
    private LabourCooperative cooperative;

    @NotNull
    @Builder.Default
    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate = LocalDate.now();

    @Size(max = 50)
    @Column(name = "membership_number", length = 50)
    private String membershipNumber;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private MembershipStatus status = MembershipStatus.PENDING;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_id")
    private CooperativeManager verifiedBy;
}

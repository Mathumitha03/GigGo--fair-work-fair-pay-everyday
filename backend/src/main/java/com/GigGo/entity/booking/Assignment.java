package com.GigGo.entity.booking;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.AssignmentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
    name = "assignments",
    indexes = {
        @Index(name = "idx_assignments_booking", columnList = "booking_id"),
        @Index(name = "idx_assignments_worker", columnList = "worker_id"),
        @Index(name = "idx_assignments_status", columnList = "status"),
        @Index(name = "idx_assignments_created", columnList = "created_at")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"booking", "worker"})
public class Assignment extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    /**
     * Snapshot of the worker's rotation weight when this assignment was dispatched.
     */
    @NotNull
    @Column(name = "rotation_weight_used", nullable = false, precision = 10, scale = 4)
    private BigDecimal rotationWeightUsed;

    /**
     * Priority rank in the dispatch algorithm batch (1 = highest priority).
     */
    @NotNull
    @Builder.Default
    @Column(name = "rank", nullable = false)
    private Integer rank = 1;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private AssignmentStatus status = AssignmentStatus.OFFERED;

    @NotNull
    @Builder.Default
    @Column(name = "assigned_at", nullable = false)
    private Instant assignedAt = Instant.now();

    @Column(name = "responded_at")
    private Instant respondedAt;
}

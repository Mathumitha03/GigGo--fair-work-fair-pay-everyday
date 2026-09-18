package com.GigGo.entity.profile;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.enums.WorkerVerificationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLRestriction;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;

@Entity
@Table(
    name = "workers",
    indexes = {
        @Index(name = "idx_workers_user_id", columnList = "user_id", unique = true),
        @Index(name = "idx_workers_cooperative", columnList = "primary_cooperative_id"),
        @Index(name = "idx_workers_verification", columnList = "verification_status"),
        @Index(name = "idx_workers_avail_rotation", columnList = "is_available, rotation_weight")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"user", "primaryCooperative"})
public class Worker extends BaseEntity {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_cooperative_id")
    private LabourCooperative primaryCooperative;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Builder.Default
    @Column(name = "experience_years")
    private Integer experienceYears = 0;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 30)
    private WorkerVerificationStatus verificationStatus = WorkerVerificationStatus.UNVERIFIED;

    /**
     * Weight used by the fair cooperative rotation dispatch algorithm.
     * Adjusted dynamically based on gig history and fair-share allocation.
     */
    @NotNull
    @Builder.Default
    @Column(name = "rotation_weight", nullable = false, precision = 10, scale = 4)
    private BigDecimal rotationWeight = new BigDecimal("1.0000");

    @NotNull
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "5.00")
    @Builder.Default
    @Column(name = "current_rating", nullable = false, precision = 3, scale = 2)
    private BigDecimal currentRating = new BigDecimal("5.00");

    @Builder.Default
    @Column(name = "total_ratings_count", nullable = false)
    private Integer totalRatingsCount = 0;

    @Builder.Default
    @Column(name = "total_gigs_completed", nullable = false)
    private Integer totalGigsCompleted = 0;

    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private boolean isAvailable = true;

    /**
     * Live or last reported worker location (PostGIS Point, SRID 4326).
     */
    @Column(name = "current_location", columnDefinition = "geometry(Point, 4326)")
    private Point currentLocation;

    @Builder.Default
    @Column(name = "service_radius_km")
    private Double serviceRadiusKm = 15.0;

    @Column(name = "upi_id", length = 100)
    private String upiId;

    @Column(name = "bank_account_details", columnDefinition = "TEXT")
    private String bankAccountDetails;
}

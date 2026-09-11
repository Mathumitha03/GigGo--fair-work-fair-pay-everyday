package com.GigGo.entity.booking;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.profile.Customer;
import com.GigGo.entity.profile.Worker;
import com.GigGo.entity.service.ServiceCategory;
import com.GigGo.entity.service.ServiceOffering;
import com.GigGo.enums.BookingStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
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
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
    name = "bookings",
    indexes = {
        @Index(name = "idx_bookings_ref", columnList = "booking_reference", unique = true),
        @Index(name = "idx_bookings_customer", columnList = "customer_id"),
        @Index(name = "idx_bookings_worker", columnList = "assigned_worker_id"),
        @Index(name = "idx_bookings_status", columnList = "status"),
        @Index(name = "idx_bookings_scheduled_start", columnList = "scheduled_start_time")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"customer", "serviceOffering", "serviceCategory", "assignedWorker"})
public class Booking extends BaseEntity {

    @NotBlank
    @Size(max = 64)
    @Column(name = "booking_reference", nullable = false, unique = true, length = 64)
    private String bookingReference;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_offering_id")
    private ServiceOffering serviceOffering;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_category_id", nullable = false)
    private ServiceCategory serviceCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_worker_id")
    private Worker assignedWorker;

    /**
     * PostGIS Point coordinates for service dispatch location (SRID 4326).
     */
    @NotNull
    @Column(name = "location", columnDefinition = "geometry(Point, 4326)", nullable = false)
    private Point location;

    @NotBlank
    @Size(max = 300)
    @Column(name = "service_address", nullable = false, length = 300)
    private String serviceAddress;

    @NotNull
    @Column(name = "scheduled_start_time", nullable = false)
    private Instant scheduledStartTime;

    @Column(name = "scheduled_end_time")
    private Instant scheduledEndTime;

    @Column(name = "actual_start_time")
    private Instant actualStartTime;

    @Column(name = "actual_end_time")
    private Instant actualEndTime;

    @Size(max = 50)
    @Column(name = "time_window", length = 50)
    private String timeWindow;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private BookingStatus status = BookingStatus.REQUESTED;

    @DecimalMin(value = "0.00")
    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount;

    /**
     * Cooperative fair-wage benchmark calculated for this gig.
     */
    @DecimalMin(value = "0.00")
    @Column(name = "fair_wage_estimate", precision = 12, scale = 2)
    private BigDecimal fairWageEstimate;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "cancellation_reason", length = 300)
    private String cancellationReason;
}

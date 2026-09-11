package com.GigGo.entity.booking;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.profile.Worker;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import org.locationtech.jts.geom.Point;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
    name = "worker_availabilities",
    indexes = {
        @Index(name = "idx_worker_avail_worker", columnList = "worker_id"),
        @Index(name = "idx_worker_avail_date", columnList = "available_date"),
        @Index(name = "idx_worker_avail_active", columnList = "worker_id, available_date, is_available")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = "worker")
public class WorkerAvailability extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @NotNull
    @Column(name = "available_date", nullable = false)
    private LocalDate availableDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private boolean isAvailable = true;

    /**
     * PostGIS Point coordinates for active tracking of worker availability (SRID 4326).
     */
    @Column(name = "current_location", columnDefinition = "geometry(Point, 4326)")
    private Point currentLocation;

    @Column(name = "last_location_update")
    private Instant lastLocationUpdate;
}

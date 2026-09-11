package com.GigGo.entity.booking;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.common.BaseEntity;
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
    name = "booking_status_histories",
    indexes = {
        @Index(name = "idx_booking_hist_booking", columnList = "booking_id"),
        @Index(name = "idx_booking_hist_changed_at", columnList = "changed_at")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"booking", "changedBy"})
public class BookingStatusHistory extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 30)
    private BookingStatus fromStatus;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 30)
    private BookingStatus toStatus;

    @NotNull
    @Builder.Default
    @Column(name = "changed_at", nullable = false)
    private Instant changedAt = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_id")
    private User changedBy;

    @Column(name = "notes", length = 500)
    private String notes;
}

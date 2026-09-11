package com.GigGo.entity.support;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.common.BaseEntity;
import com.GigGo.enums.ComplaintCategory;
import com.GigGo.enums.ComplaintStatus;
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
    name = "complaints",
    indexes = {
        @Index(name = "idx_complaints_number", columnList = "complaint_number", unique = true),
        @Index(name = "idx_complaints_booking", columnList = "booking_id"),
        @Index(name = "idx_complaints_raised_by", columnList = "raised_by_id"),
        @Index(name = "idx_complaints_against", columnList = "against_id"),
        @Index(name = "idx_complaints_status", columnList = "status")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"booking", "raisedBy", "against", "resolvedBy"})
public class Complaint extends BaseEntity {

    @NotBlank
    @Size(max = 64)
    @Column(name = "complaint_number", nullable = false, unique = true, length = 64)
    private String complaintNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raised_by_id", nullable = false)
    private User raisedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "against_id")
    private User against;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private ComplaintCategory category;

    @NotBlank
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "evidence_urls", columnDefinition = "TEXT")
    private String evidenceUrls;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ComplaintStatus status = ComplaintStatus.SUBMITTED;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    /**
     * The CooperativeManager or Admin user who resolved or dismissed this complaint.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by_id")
    private User resolvedBy;

    @Column(name = "resolved_at")
    private Instant resolvedAt;
}

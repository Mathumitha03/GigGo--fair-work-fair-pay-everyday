package com.GigGo.entity.cooperative;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.CooperativeRequestStatus;
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
    name = "cooperative_creation_requests",
    indexes = {
        @Index(name = "idx_coop_req_worker", columnList = "worker_id"),
        @Index(name = "idx_coop_req_status", columnList = "status"),
        @Index(name = "idx_coop_req_created_at", columnList = "created_at")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"worker", "reviewedBy", "createdCooperative"})
public class CooperativeCreationRequest extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @NotBlank
    @Size(max = 150)
    @Column(name = "proposed_name", nullable = false, length = 150)
    private String proposedName;

    @NotBlank
    @Size(max = 100)
    @Column(name = "proposed_registration_number", nullable = false, length = 100)
    private String proposedRegistrationNumber;

    @NotBlank
    @Size(max = 100)
    @Column(name = "proposed_region", nullable = false, length = 100)
    private String proposedRegion;

    @Column(name = "proposed_address", length = 300)
    private String proposedAddress;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "rationale", columnDefinition = "TEXT")
    private String rationale;

    @Column(name = "supporting_document_url", length = 500)
    private String supportingDocumentUrl;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private CooperativeRequestStatus status = CooperativeRequestStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "admin_notes", length = 500)
    private String adminNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_cooperative_id")
    private LabourCooperative createdCooperative;
}

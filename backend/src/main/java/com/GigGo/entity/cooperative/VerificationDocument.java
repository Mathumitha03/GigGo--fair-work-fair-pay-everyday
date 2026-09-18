package com.GigGo.entity.cooperative;

import com.GigGo.entity.common.BaseEntity;
import com.GigGo.entity.profile.CooperativeManager;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.DocumentStatus;
import com.GigGo.enums.DocumentType;
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
    name = "verification_documents",
    indexes = {
        @Index(name = "idx_verif_docs_worker", columnList = "worker_id"),
        @Index(name = "idx_verif_docs_status", columnList = "status"),
        @Index(name = "idx_verif_docs_type", columnList = "document_type")
    }
)
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(exclude = {"worker", "reviewedBy"})
public class VerificationDocument extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 50)
    private DocumentType documentType;

    @Size(max = 100)
    @Column(name = "document_number", length = 100)
    private String documentNumber;

    @NotBlank
    @Size(max = 500)
    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    @NotNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private DocumentStatus status = DocumentStatus.PENDING;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private CooperativeManager reviewedBy;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;
}

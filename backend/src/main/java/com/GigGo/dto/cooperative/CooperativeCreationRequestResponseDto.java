package com.GigGo.dto.cooperative;

import com.GigGo.enums.CooperativeRequestStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CooperativeCreationRequestResponseDto {

    private UUID id;
    private UUID workerId;
    private String workerName;
    private String workerPhone;
    private String workerEmail;

    private String proposedName;
    private String proposedRegistrationNumber;
    private String proposedRegion;
    private String proposedAddress;
    private String contactEmail;
    private String contactPhone;
    private String rationale;
    private String supportingDocumentUrl;

    private CooperativeRequestStatus status;
    private UUID reviewedById;
    private String reviewedByName;
    private Instant reviewedAt;
    private String adminNotes;
    private UUID createdCooperativeId;
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getWorkerId() { return workerId; }
    public void setWorkerId(UUID workerId) { this.workerId = workerId; }

    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) { this.workerName = workerName; }

    public String getWorkerPhone() { return workerPhone; }
    public void setWorkerPhone(String workerPhone) { this.workerPhone = workerPhone; }

    public String getWorkerEmail() { return workerEmail; }
    public void setWorkerEmail(String workerEmail) { this.workerEmail = workerEmail; }

    public String getProposedName() { return proposedName; }
    public void setProposedName(String proposedName) { this.proposedName = proposedName; }

    public String getProposedRegistrationNumber() { return proposedRegistrationNumber; }
    public void setProposedRegistrationNumber(String proposedRegistrationNumber) { this.proposedRegistrationNumber = proposedRegistrationNumber; }

    public String getProposedRegion() { return proposedRegion; }
    public void setProposedRegion(String proposedRegion) { this.proposedRegion = proposedRegion; }

    public String getProposedAddress() { return proposedAddress; }
    public void setProposedAddress(String proposedAddress) { this.proposedAddress = proposedAddress; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public String getSupportingDocumentUrl() { return supportingDocumentUrl; }
    public void setSupportingDocumentUrl(String supportingDocumentUrl) { this.supportingDocumentUrl = supportingDocumentUrl; }

    public CooperativeRequestStatus getStatus() { return status; }
    public void setStatus(CooperativeRequestStatus status) { this.status = status; }

    public UUID getReviewedById() { return reviewedById; }
    public void setReviewedById(UUID reviewedById) { this.reviewedById = reviewedById; }

    public String getReviewedByName() { return reviewedByName; }
    public void setReviewedByName(String reviewedByName) { this.reviewedByName = reviewedByName; }

    public Instant getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public UUID getCreatedCooperativeId() { return createdCooperativeId; }
    public void setCreatedCooperativeId(UUID createdCooperativeId) { this.createdCooperativeId = createdCooperativeId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

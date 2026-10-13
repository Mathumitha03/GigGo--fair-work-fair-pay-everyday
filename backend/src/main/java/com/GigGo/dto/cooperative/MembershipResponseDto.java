package com.GigGo.dto.cooperative;

import com.GigGo.enums.MembershipStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MembershipResponseDto {

    private UUID id;
    private UUID workerId;
    private String workerName;
    private String workerPhone;
    private String workerEmail;
    private String workerSkills;

    private UUID cooperativeId;
    private String cooperativeName;
    private String membershipNumber;

    private MembershipStatus status;
    private LocalDate joinDate;
    private String requestNotes;
    private String rejectionReason;

    private UUID verifiedById;
    private String verifiedByName;
    private Instant verifiedAt;
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

    public String getWorkerSkills() { return workerSkills; }
    public void setWorkerSkills(String workerSkills) { this.workerSkills = workerSkills; }

    public UUID getCooperativeId() { return cooperativeId; }
    public void setCooperativeId(UUID cooperativeId) { this.cooperativeId = cooperativeId; }

    public String getCooperativeName() { return cooperativeName; }
    public void setCooperativeName(String cooperativeName) { this.cooperativeName = cooperativeName; }

    public String getMembershipNumber() { return membershipNumber; }
    public void setMembershipNumber(String membershipNumber) { this.membershipNumber = membershipNumber; }

    public MembershipStatus getStatus() { return status; }
    public void setStatus(MembershipStatus status) { this.status = status; }

    public LocalDate getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }

    public String getRequestNotes() { return requestNotes; }
    public void setRequestNotes(String requestNotes) { this.requestNotes = requestNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public UUID getVerifiedById() { return verifiedById; }
    public void setVerifiedById(UUID verifiedById) { this.verifiedById = verifiedById; }

    public String getVerifiedByName() { return verifiedByName; }
    public void setVerifiedByName(String verifiedByName) { this.verifiedByName = verifiedByName; }

    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

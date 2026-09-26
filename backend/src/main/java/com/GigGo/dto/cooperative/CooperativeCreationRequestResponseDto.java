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
}

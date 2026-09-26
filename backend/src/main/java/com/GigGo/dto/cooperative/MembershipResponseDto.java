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
}

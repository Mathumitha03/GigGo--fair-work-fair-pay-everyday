package com.GigGo.dto.auth;

import com.GigGo.enums.AffiliationStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.enums.WorkerVerificationStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileDto {

    private UUID id;
    private String name;
    private String username;
    private String email;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private String languagePreference;
    private String profileImageUrl;

    // Worker specific
    private UUID workerId;
    private Boolean isAffiliated;
    private AffiliationStatus affiliationStatus;
    private WorkerVerificationStatus verificationStatus;
    private UUID primaryCooperativeId;
    private String primaryCooperativeName;
    private String skills;
    private Integer experienceYears;
    private BigDecimal currentRating;
    private Integer totalGigsCompleted;
    private String welfareMemberId;
    private String insurancePolicyNumber;

    // Cooperative Manager specific
    private UUID managerId;
    private UUID managedCooperativeId;
    private String managedCooperativeName;
    private String designation;

    // Customer specific
    private UUID customerId;
    private String defaultAddress;
    private String city;
    private String state;

    // Admin specific
    private UUID adminId;
    private String department;
    private Boolean isSuperAdmin;
}

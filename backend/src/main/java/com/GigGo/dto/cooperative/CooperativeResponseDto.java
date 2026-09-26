package com.GigGo.dto.cooperative;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CooperativeResponseDto {

    private UUID id;
    private String name;
    private String registrationNumber;
    private String region;
    private String address;
    private String contactEmail;
    private String contactPhone;
    private String description;
    private BigDecimal commissionRate;
    private BigDecimal welfareFundBalance;
    private String insuranceSchemeDetails;
    private boolean isActive;
    private UUID createdByWorkerId;
    private String createdByWorkerName;
    private Instant createdAt;
}

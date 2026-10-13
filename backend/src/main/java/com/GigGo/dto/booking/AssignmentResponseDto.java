package com.GigGo.dto.booking;

import com.GigGo.enums.AssignmentStatus;
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
public class AssignmentResponseDto {

    private UUID id;
    private UUID bookingId;
    private String bookingReference;

    // Worker info
    private UUID workerId;
    private String workerName;
    private UUID workerCooperativeId;
    private String workerCooperativeName;

    // Customer & Problem info
    private UUID customerId;
    private String customerName;
    private String customerPhone;
    private String serviceAddress;
    private String specialInstructions;
    private String serviceCategoryName;

    private AssignmentStatus status;
    private Integer rank;
    private BigDecimal rotationWeightUsed;
    private Instant assignedAt;
    private Instant expiresAt; // assignedAt + 30 seconds
    private Instant respondedAt;
}

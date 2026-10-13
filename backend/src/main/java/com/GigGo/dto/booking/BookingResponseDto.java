package com.GigGo.dto.booking;

import com.GigGo.enums.BookingStatus;
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
public class BookingResponseDto {

    private UUID id;
    private String bookingReference;

    // Customer info
    private UUID customerId;
    private String customerName;
    private String customerPhone;
    private UUID customerCooperativeId;
    private String customerCooperativeName;

    // Service category & offering
    private UUID serviceCategoryId;
    private String serviceCategoryName;
    private UUID serviceOfferingId;

    // Worker info (if assigned / accepted)
    private UUID assignedWorkerId;
    private String assignedWorkerName;
    private String assignedWorkerPhone;

    private String serviceAddress;
    private Double latitude;
    private Double longitude;
    private Instant scheduledStartTime;
    private Instant scheduledEndTime;
    private Instant actualStartTime;
    private Instant actualEndTime;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private BigDecimal fairWageEstimate;
    private String specialInstructions;
    private String cancellationReason;

    // Current active offer details if any
    private AssignmentResponseDto currentAssignment;

    private Instant createdAt;
    private Instant updatedAt;
}

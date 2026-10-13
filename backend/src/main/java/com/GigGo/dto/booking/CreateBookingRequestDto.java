package com.GigGo.dto.booking;

import jakarta.validation.constraints.NotBlank;
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
public class CreateBookingRequestDto {

    private UUID serviceCategoryId;
    private UUID serviceOfferingId;

    @NotBlank(message = "Service address is required")
    private String serviceAddress;

    private String specialInstructions;
    private Double latitude;
    private Double longitude;
    private Instant scheduledStartTime;
    private String timeWindow;
    private BigDecimal totalAmount;
    private BigDecimal fairWageEstimate;
}

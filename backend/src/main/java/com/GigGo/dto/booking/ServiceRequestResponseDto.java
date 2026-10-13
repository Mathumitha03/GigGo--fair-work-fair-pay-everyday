package com.GigGo.dto.booking;

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
public class ServiceRequestResponseDto {

    private UUID requestId;
    private String bookingReference;
    private String service;
    private String serviceName;
    private UUID serviceId;
    private String problem;
    private String problemName;
    private UUID problemId;
    private UUID customerId;
    private String customerName;
    private UUID societyId;
    private String societyName;
    private String status;
    private Double latitude;
    private Double longitude;
    private String serviceAddress;
    private Instant createdAt;

    private WorkerSummaryDto assignedWorker;
    private Instant offerExpiresAt;
    private Integer attemptNumber;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class WorkerSummaryDto {
        private String workerId;
        private String name;
        private String phone;
    }
}

package com.GigGo.controller;

import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.booking.CreateServiceRequestDto;
import com.GigGo.dto.booking.ServiceRequestResponseDto;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.BookingService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/api/v1/service-requests")
@RequiredArgsConstructor
@Tag(name = "Customer Service Requests", description = "Endpoints for creating and retrieving customer service requests")
public class ServiceRequestController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Create Service Request", description = "Creates a customer service request with selected service, problem, and GPS location. Customer and Society are derived strictly from the SecurityContext.")
    public ResponseEntity<ApiResponse<ServiceRequestResponseDto>> createServiceRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateServiceRequestDto request) {

        ServiceRequestResponseDto response = bookingService.createServiceRequest(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Service request created successfully. Searching for available workers."));
    }

    @GetMapping("/{requestId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get Service Request Details", description = "Retrieves current details and status of a service request. Customer can only access their own request.")
    public ResponseEntity<ApiResponse<ServiceRequestResponseDto>> getServiceRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID requestId) {

        ServiceRequestResponseDto response = bookingService.getServiceRequestById(requestId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Service request details retrieved successfully."));
    }

    @DeleteMapping("/{requestId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Cancel Service Request", description = "Cancels an active customer service request.")
    public ResponseEntity<ApiResponse<ServiceRequestResponseDto>> cancelServiceRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID requestId) {

        ServiceRequestResponseDto response = bookingService.cancelServiceRequest(requestId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Service request cancelled successfully."));
    }

    @PostMapping("/{requestId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Cancel Service Request (POST)", description = "Alias endpoint to cancel an active customer service request.")
    public ResponseEntity<ApiResponse<ServiceRequestResponseDto>> cancelServiceRequestPost(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID requestId) {

        ServiceRequestResponseDto response = bookingService.cancelServiceRequest(requestId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Service request cancelled successfully."));
    }
}

package com.GigGo.controller;

import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.booking.AssignmentResponseDto;
import com.GigGo.dto.booking.BookingResponseDto;
import com.GigGo.dto.booking.RespondAssignmentDto;
import com.GigGo.dto.booking.WorkerAvailabilityDto;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/worker")
@RequiredArgsConstructor
@Tag(name = "Worker Assignments", description = "Endpoints for Workers to view pending gig offers, accept/reject offers, and toggle online availability")
public class WorkerAssignmentController {

    private final BookingService bookingService;

    @GetMapping("/assignments")
    @PreAuthorize("hasAnyRole('WORKER', 'COOPERATIVE_MANAGER')")
    @Operation(summary = "Get Worker Assignments", description = "Retrieves all gig assignment offers dispatched to the authenticated worker.")
    public ResponseEntity<ApiResponse<List<AssignmentResponseDto>>> getWorkerAssignments(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        List<AssignmentResponseDto> response = bookingService.getWorkerAssignments(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Worker assignments retrieved successfully."));
    }

    @GetMapping("/assignments/pending")
    @PreAuthorize("hasAnyRole('WORKER', 'COOPERATIVE_MANAGER')")
    @Operation(summary = "Get Active Pending Offer", description = "Retrieves the worker's current active pending 30-second offer, if any.")
    public ResponseEntity<ApiResponse<AssignmentResponseDto>> getPendingAssignment(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AssignmentResponseDto response = bookingService.getPendingWorkerAssignment(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, response != null ? "Pending assignment offer retrieved." : "No active pending offer."));
    }

    @PostMapping("/assignments/{assignmentId}/respond")
    @PreAuthorize("hasRole('WORKER')")
    @Operation(summary = "Respond to Assignment Offer", description = "Accepts or rejects an offered gig assignment.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> respondToAssignment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID assignmentId,
            @Valid @RequestBody RespondAssignmentDto responseDto) {

        BookingResponseDto response = bookingService.respondToAssignment(currentUser.getId(), assignmentId, responseDto);
        return ResponseEntity.ok(ApiResponse.success(response, Boolean.TRUE.equals(responseDto.getAccept()) ? "Assignment ACCEPTED successfully." : "Assignment REJECTED. Dispatched next worker."));
    }

    @PostMapping("/assignments/{assignmentId}/accept")
    @PreAuthorize("hasRole('WORKER')")
    @Operation(summary = "Accept Assignment Offer", description = "Shortcut endpoint to accept a gig assignment offer.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> acceptAssignment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID assignmentId) {

        RespondAssignmentDto responseDto = RespondAssignmentDto.builder().accept(true).build();
        BookingResponseDto response = bookingService.respondToAssignment(currentUser.getId(), assignmentId, responseDto);
        return ResponseEntity.ok(ApiResponse.success(response, "Assignment ACCEPTED successfully."));
    }

    @PostMapping("/assignments/{assignmentId}/reject")
    @PreAuthorize("hasRole('WORKER')")
    @Operation(summary = "Reject Assignment Offer", description = "Shortcut endpoint to reject a gig assignment offer.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> rejectAssignment(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID assignmentId) {

        RespondAssignmentDto responseDto = RespondAssignmentDto.builder().accept(false).build();
        BookingResponseDto response = bookingService.respondToAssignment(currentUser.getId(), assignmentId, responseDto);
        return ResponseEntity.ok(ApiResponse.success(response, "Assignment REJECTED. Dispatched next worker in society."));
    }

    @PostMapping("/requests/{requestId}/respond")
    @PreAuthorize("hasRole('WORKER')")
    @Operation(summary = "Respond to Service Request Offer", description = "Accepts or rejects an active gig offer for a service request.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> respondToRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID requestId,
            @Valid @RequestBody RespondAssignmentDto responseDto) {

        BookingResponseDto response = bookingService.respondToRequest(currentUser.getId(), requestId, responseDto);
        return ResponseEntity.ok(ApiResponse.success(response, Boolean.TRUE.equals(responseDto.getAccept()) ? "Assignment ACCEPTED successfully." : "Assignment REJECTED. Dispatched next worker."));
    }

    @PostMapping("/requests/{requestId}/accept")
    @PreAuthorize("hasRole('WORKER')")
    @Operation(summary = "Accept Service Request Offer", description = "Shortcut endpoint to accept an active gig offer for a service request.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> acceptRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID requestId) {

        RespondAssignmentDto responseDto = RespondAssignmentDto.builder().accept(true).build();
        BookingResponseDto response = bookingService.respondToRequest(currentUser.getId(), requestId, responseDto);
        return ResponseEntity.ok(ApiResponse.success(response, "Assignment ACCEPTED successfully."));
    }

    @PostMapping("/requests/{requestId}/reject")
    @PreAuthorize("hasRole('WORKER')")
    @Operation(summary = "Reject Service Request Offer", description = "Shortcut endpoint to reject an active gig offer for a service request.")
    public ResponseEntity<ApiResponse<BookingResponseDto>> rejectRequest(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable UUID requestId) {

        RespondAssignmentDto responseDto = RespondAssignmentDto.builder().accept(false).build();
        BookingResponseDto response = bookingService.respondToRequest(currentUser.getId(), requestId, responseDto);
        return ResponseEntity.ok(ApiResponse.success(response, "Assignment REJECTED. Dispatched next worker in society."));
    }

    @PutMapping("/availability")
    @PreAuthorize("hasAnyRole('WORKER', 'COOPERATIVE_MANAGER')")
    @Operation(summary = "Toggle Worker Availability", description = "Updates worker online/offline availability and location.")
    public ResponseEntity<ApiResponse<Void>> updateAvailability(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody WorkerAvailabilityDto availabilityDto) {

        bookingService.updateWorkerAvailability(currentUser.getId(), availabilityDto);
        return ResponseEntity.ok(ApiResponse.success(null, "Worker availability updated successfully."));
    }
}

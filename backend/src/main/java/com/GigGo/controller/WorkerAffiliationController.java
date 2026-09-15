package com.GigGo.controller;

import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.cooperative.CooperativeCreationRequestResponseDto;
import com.GigGo.dto.cooperative.CreateCooperativeRequestDto;
import com.GigGo.dto.cooperative.JoinCooperativeRequestDto;
import com.GigGo.dto.cooperative.MembershipResponseDto;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.CooperativeAffiliationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/worker/cooperatives")
@RequiredArgsConstructor
@Tag(name = "Worker Cooperative Affiliation", description = "Endpoints for Workers to request new society creation or join existing societies")
public class WorkerAffiliationController {

    private final CooperativeAffiliationService affiliationService;

    // --- Option 1: Worker sends request to create a new cooperative society ---
    @PostMapping("/request-creation")
    @PreAuthorize("hasAnyRole('WORKER', 'COOPERATIVE_MANAGER')")
    @Operation(summary = "Option 1: Request New Cooperative Society Creation", description = "Worker sends request to Admin. If approved, worker becomes Cooperative Manager and affiliated member.")
    public ResponseEntity<ApiResponse<CooperativeCreationRequestResponseDto>> requestSocietyCreation(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateCooperativeRequestDto requestDto) {

        CooperativeCreationRequestResponseDto response = affiliationService.submitCreationRequest(userPrincipal.getId(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Cooperative creation request submitted successfully. Awaiting Federation Admin approval."));
    }

    @GetMapping("/creation-requests")
    @PreAuthorize("hasAnyRole('WORKER', 'COOPERATIVE_MANAGER')")
    @Operation(summary = "Get Worker's Society Creation Requests", description = "Lists creation requests submitted by the logged-in worker")
    public ResponseEntity<ApiResponse<List<CooperativeCreationRequestResponseDto>>> getMyCreationRequests(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<CooperativeCreationRequestResponseDto> list = affiliationService.getWorkerCreationRequests(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(list, "Creation requests retrieved successfully"));
    }

    // --- Option 2: Worker sends request to join an existing cooperative society ---
    @PostMapping("/request-join")
    @PreAuthorize("hasRole('WORKER')")
    @Operation(summary = "Option 2: Request to Join Existing Cooperative Society", description = "Worker sends request to join an existing cooperative. If Moderator approves, worker becomes an affiliated member.")
    public ResponseEntity<ApiResponse<MembershipResponseDto>> requestJoinSociety(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody JoinCooperativeRequestDto joinDto) {

        MembershipResponseDto response = affiliationService.submitJoinRequest(userPrincipal.getId(), joinDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Join request submitted successfully. Awaiting Cooperative Moderator approval."));
    }

    @GetMapping("/memberships")
    @PreAuthorize("hasAnyRole('WORKER', 'COOPERATIVE_MANAGER')")
    @Operation(summary = "Get Worker's Cooperative Memberships", description = "Lists all membership requests and active affiliations for the worker")
    public ResponseEntity<ApiResponse<List<MembershipResponseDto>>> getMyMemberships(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<MembershipResponseDto> list = affiliationService.getWorkerMemberships(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(list, "Memberships retrieved successfully"));
    }
}

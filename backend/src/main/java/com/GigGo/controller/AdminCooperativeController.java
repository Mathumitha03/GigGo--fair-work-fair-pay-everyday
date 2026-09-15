package com.GigGo.controller;

import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.cooperative.AdminReviewRequestDto;
import com.GigGo.dto.cooperative.CooperativeCreationRequestResponseDto;
import com.GigGo.enums.CooperativeRequestStatus;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.CooperativeAffiliationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/cooperatives")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Cooperative Federation Governance", description = "Endpoints for Federation Admins to review and approve/reject society creation requests")
public class AdminCooperativeController {

    private final CooperativeAffiliationService affiliationService;

    @GetMapping("/requests")
    @Operation(summary = "Get Cooperative Creation Requests", description = "Lists society creation requests submitted by workers, filterable by status")
    public ResponseEntity<ApiResponse<List<CooperativeCreationRequestResponseDto>>> getCreationRequests(
            @RequestParam(required = false) CooperativeRequestStatus status) {

        List<CooperativeCreationRequestResponseDto> list = affiliationService.getCreationRequests(status);
        return ResponseEntity.ok(ApiResponse.success(list, "Cooperative creation requests retrieved successfully"));
    }

    @PutMapping("/requests/{requestId}/review")
    @Operation(summary = "Review Cooperative Creation Request", description = "Admin approves or rejects. If approved, creates LabourCooperative and promotes Worker to Cooperative Manager.")
    public ResponseEntity<ApiResponse<CooperativeCreationRequestResponseDto>> reviewCreationRequest(
            @AuthenticationPrincipal UserPrincipal adminPrincipal,
            @PathVariable UUID requestId,
            @Valid @RequestBody AdminReviewRequestDto reviewDto) {

        CooperativeCreationRequestResponseDto response = affiliationService.reviewCreationRequest(adminPrincipal.getId(), requestId, reviewDto);
        String msg = (reviewDto.getStatus() == CooperativeRequestStatus.APPROVED)
                ? "Cooperative society creation approved! Society created and worker promoted to Cooperative Manager."
                : "Cooperative society creation request rejected.";
        return ResponseEntity.ok(ApiResponse.success(response, msg));
    }
}

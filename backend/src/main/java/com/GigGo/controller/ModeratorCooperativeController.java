package com.GigGo.controller;

import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.cooperative.MembershipResponseDto;
import com.GigGo.dto.cooperative.ModeratorReviewRequestDto;
import com.GigGo.enums.MembershipStatus;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cooperative-manager/memberships")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('COOPERATIVE_MANAGER', 'ADMIN')")
@Tag(name = "Cooperative Manager & Moderator Actions", description = "Endpoints for Society Managers/Moderators to review worker join requests")
public class ModeratorCooperativeController {

    private final CooperativeAffiliationService affiliationService;

    @GetMapping("/pending")
    @Operation(summary = "Get Pending Worker Join Requests", description = "Lists pending join requests for the logged-in manager's cooperative society")
    public ResponseEntity<ApiResponse<List<MembershipResponseDto>>> getPendingJoinRequests(
            @AuthenticationPrincipal UserPrincipal managerPrincipal) {

        List<MembershipResponseDto> list = affiliationService.getPendingMembershipsForManager(managerPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(list, "Pending membership requests retrieved successfully"));
    }

    @PutMapping("/{membershipId}/review")
    @Operation(summary = "Review Worker Join Request", description = "Moderator accepts or rejects. If accepted, worker becomes an affiliated member of this society.")
    public ResponseEntity<ApiResponse<MembershipResponseDto>> reviewJoinRequest(
            @AuthenticationPrincipal UserPrincipal managerPrincipal,
            @PathVariable UUID membershipId,
            @Valid @RequestBody ModeratorReviewRequestDto reviewDto) {

        MembershipResponseDto response = affiliationService.reviewMembership(managerPrincipal.getId(), membershipId, reviewDto);
        String msg = (reviewDto.getStatus() == MembershipStatus.ACTIVE)
                ? "Worker join request approved! Worker is now an affiliated member of your cooperative society."
                : "Worker join request rejected.";
        return ResponseEntity.ok(ApiResponse.success(response, msg));
    }
}

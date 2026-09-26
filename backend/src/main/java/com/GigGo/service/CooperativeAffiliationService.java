package com.GigGo.service;

import com.GigGo.dto.cooperative.AdminReviewRequestDto;
import com.GigGo.dto.cooperative.CooperativeCreationRequestResponseDto;
import com.GigGo.dto.cooperative.CooperativeResponseDto;
import com.GigGo.dto.cooperative.CreateCooperativeRequestDto;
import com.GigGo.dto.cooperative.JoinCooperativeRequestDto;
import com.GigGo.dto.cooperative.MembershipResponseDto;
import com.GigGo.dto.cooperative.ModeratorReviewRequestDto;
import com.GigGo.enums.CooperativeRequestStatus;

import java.util.List;
import java.util.UUID;

public interface CooperativeAffiliationService {

    // --- Worker Option 1: Request New Society Creation ---
    CooperativeCreationRequestResponseDto submitCreationRequest(UUID workerUserId, CreateCooperativeRequestDto dto);

    List<CooperativeCreationRequestResponseDto> getCreationRequests(CooperativeRequestStatus status);

    List<CooperativeCreationRequestResponseDto> getWorkerCreationRequests(UUID workerUserId);

    CooperativeCreationRequestResponseDto reviewCreationRequest(UUID adminUserId, UUID requestId, AdminReviewRequestDto dto);

    // --- Worker Option 2: Request to Join Existing Society ---
    MembershipResponseDto submitJoinRequest(UUID workerUserId, JoinCooperativeRequestDto dto);

    List<MembershipResponseDto> getPendingMembershipsForManager(UUID managerUserId);

    List<MembershipResponseDto> getWorkerMemberships(UUID workerUserId);

    MembershipResponseDto reviewMembership(UUID managerUserId, UUID membershipId, ModeratorReviewRequestDto dto);

    // --- Affiliation Verification Check (Critical Business Rule) ---
    boolean isWorkerAffiliated(UUID workerId);

    // --- Cooperative Catalog ---
    List<CooperativeResponseDto> getAllActiveCooperatives();

    CooperativeResponseDto getCooperativeById(UUID cooperativeId);
}

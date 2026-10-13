package com.GigGo;

import com.GigGo.controller.WorkerAffiliationController;
import com.GigGo.dto.common.ApiResponse;
import com.GigGo.dto.cooperative.CooperativeCreationRequestResponseDto;
import com.GigGo.dto.cooperative.CreateCooperativeRequestDto;
import com.GigGo.dto.cooperative.JoinCooperativeRequestDto;
import com.GigGo.dto.cooperative.MembershipResponseDto;
import com.GigGo.enums.CooperativeRequestStatus;
import com.GigGo.enums.MembershipStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.CooperativeAffiliationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WorkerAffiliationControllerTest {

    @Mock
    private CooperativeAffiliationService affiliationService;

    @InjectMocks
    private WorkerAffiliationController controller;

    private UserPrincipal workerPrincipal;
    private UUID workerUserId;

    @BeforeEach
    void setUp() {
        workerUserId = UUID.randomUUID();
        workerPrincipal = new UserPrincipal(
                workerUserId,
                "Kavitha",
                "kavitha_worker",
                "kavitha@example.com",
                "9894942320",
                "password",
                UserRole.WORKER,
                UserStatus.ACTIVE,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_WORKER"))
        );
    }

    @Test
    @DisplayName("requestSocietyCreation returns CREATED status and ApiResponse")
    void testRequestSocietyCreation() {
        CreateCooperativeRequestDto dto = new CreateCooperativeRequestDto();
        dto.setProposedName("Builders Cooperative");
        dto.setProposedRegistrationNumber("COOP-100");
        dto.setProposedRegion("Chennai");

        CooperativeCreationRequestResponseDto responseDto = new CooperativeCreationRequestResponseDto();
        responseDto.setId(UUID.randomUUID());
        responseDto.setProposedName("Builders Cooperative");
        responseDto.setStatus(CooperativeRequestStatus.PENDING);

        when(affiliationService.submitCreationRequest(eq(workerUserId), any(CreateCooperativeRequestDto.class)))
                .thenReturn(responseDto);

        ResponseEntity<ApiResponse<CooperativeCreationRequestResponseDto>> responseEntity =
                controller.requestSocietyCreation(workerPrincipal, dto);

        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(CooperativeRequestStatus.PENDING, responseEntity.getBody().getData().getStatus());
        verify(affiliationService).submitCreationRequest(eq(workerUserId), any(CreateCooperativeRequestDto.class));
    }

    @Test
    @DisplayName("getMyCreationRequests returns list of creation requests")
    void testGetMyCreationRequests() {
        CooperativeCreationRequestResponseDto responseDto = new CooperativeCreationRequestResponseDto();
        responseDto.setId(UUID.randomUUID());
        responseDto.setProposedName("Builders Cooperative");
        responseDto.setStatus(CooperativeRequestStatus.PENDING);

        when(affiliationService.getWorkerCreationRequests(workerUserId))
                .thenReturn(Collections.singletonList(responseDto));

        ResponseEntity<ApiResponse<List<CooperativeCreationRequestResponseDto>>> responseEntity =
                controller.getMyCreationRequests(workerPrincipal);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(1, responseEntity.getBody().getData().size());
        verify(affiliationService).getWorkerCreationRequests(workerUserId);
    }

    @Test
    @DisplayName("requestJoinSociety returns CREATED status and ApiResponse")
    void testRequestJoinSociety() {
        UUID coopId = UUID.randomUUID();
        JoinCooperativeRequestDto joinDto = new JoinCooperativeRequestDto();
        joinDto.setCooperativeId(coopId);
        joinDto.setRequestNotes("Joining request");

        MembershipResponseDto responseDto = new MembershipResponseDto();
        responseDto.setId(UUID.randomUUID());
        responseDto.setCooperativeId(coopId);
        responseDto.setStatus(MembershipStatus.PENDING);

        when(affiliationService.submitJoinRequest(eq(workerUserId), any(JoinCooperativeRequestDto.class)))
                .thenReturn(responseDto);

        ResponseEntity<ApiResponse<MembershipResponseDto>> responseEntity =
                controller.requestJoinSociety(workerPrincipal, joinDto);

        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(MembershipStatus.PENDING, responseEntity.getBody().getData().getStatus());
        verify(affiliationService).submitJoinRequest(eq(workerUserId), any(JoinCooperativeRequestDto.class));
    }

    @Test
    @DisplayName("getMyMemberships returns list of worker memberships")
    void testGetMyMemberships() {
        MembershipResponseDto responseDto = new MembershipResponseDto();
        responseDto.setId(UUID.randomUUID());
        responseDto.setStatus(MembershipStatus.ACTIVE);

        when(affiliationService.getWorkerMemberships(workerUserId))
                .thenReturn(Collections.singletonList(responseDto));

        ResponseEntity<ApiResponse<List<MembershipResponseDto>>> responseEntity =
                controller.getMyMemberships(workerPrincipal);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(1, responseEntity.getBody().getData().size());
        verify(affiliationService).getWorkerMemberships(workerUserId);
    }
}

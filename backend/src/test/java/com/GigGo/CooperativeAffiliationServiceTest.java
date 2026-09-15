package com.GigGo;

import com.GigGo.dto.cooperative.AdminReviewRequestDto;
import com.GigGo.dto.cooperative.CooperativeCreationRequestResponseDto;
import com.GigGo.dto.cooperative.CreateCooperativeRequestDto;
import com.GigGo.dto.cooperative.JoinCooperativeRequestDto;
import com.GigGo.dto.cooperative.MembershipResponseDto;
import com.GigGo.dto.cooperative.ModeratorReviewRequestDto;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.cooperative.CooperativeCreationRequest;
import com.GigGo.entity.cooperative.CooperativeMembership;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.CooperativeManager;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.AffiliationStatus;
import com.GigGo.enums.CooperativeRequestStatus;
import com.GigGo.enums.MembershipStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.enums.WorkerVerificationStatus;
import com.GigGo.repository.CooperativeCreationRequestRepository;
import com.GigGo.repository.CooperativeManagerRepository;
import com.GigGo.repository.CooperativeMembershipRepository;
import com.GigGo.repository.LabourCooperativeRepository;
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.service.impl.CooperativeAffiliationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CooperativeAffiliationServiceTest {

    @Mock
    private CooperativeCreationRequestRepository creationRequestRepository;

    @Mock
    private CooperativeMembershipRepository membershipRepository;

    @Mock
    private LabourCooperativeRepository cooperativeRepository;

    @Mock
    private WorkerRepository workerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CooperativeManagerRepository cooperativeManagerRepository;

    @InjectMocks
    private CooperativeAffiliationServiceImpl affiliationService;

    private User workerUser;
    private Worker worker;
    private User adminUser;
    private LabourCooperative existingCoop;
    private User managerUser;
    private CooperativeManager manager;

    @BeforeEach
    void setUp() {
        workerUser = User.builder()
                .name("Kavitha (Plumber)")
                .username("kavitha_plumber")
                .email("kavitha@example.com")
                .phone("9894942320")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();
        workerUser.setId(UUID.randomUUID());

        worker = Worker.builder()
                .user(workerUser)
                .skills("Plumber, Pipe Fitting")
                .experienceYears(4)
                .affiliationStatus(AffiliationStatus.UNAFFILIATED)
                .verificationStatus(WorkerVerificationStatus.UNVERIFIED)
                .build();
        worker.setId(UUID.randomUUID());

        adminUser = User.builder()
                .name("Admin")
                .username("admin")
                .email("admin@giggo.coop")
                .phone("9894942303")
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();
        adminUser.setId(UUID.randomUUID());

        existingCoop = LabourCooperative.builder()
                .name("Apex Labour Cooperative Society")
                .registrationNumber("TN-COOP-001")
                .region("Chennai")
                .commissionRate(new BigDecimal("5.00"))
                .isActive(true)
                .build();
        existingCoop.setId(UUID.randomUUID());

        managerUser = User.builder()
                .name("Ramesh Kumar")
                .username("ramesh_manager")
                .role(UserRole.COOPERATIVE_MANAGER)
                .status(UserStatus.ACTIVE)
                .build();
        managerUser.setId(UUID.randomUUID());

        manager = CooperativeManager.builder()
                .user(managerUser)
                .cooperative(existingCoop)
                .designation("General Secretary")
                .build();
        manager.setId(UUID.randomUUID());
    }

    @Test
    @DisplayName("Option 1: Worker submits Society Creation Request (PENDING state)")
    void testOption1_SubmitCreationRequest() {
        CreateCooperativeRequestDto dto = CreateCooperativeRequestDto.builder()
                .proposedName("Builders & Carpenters Labour Cooperative")
                .proposedRegistrationNumber("COOP-REQ-999")
                .proposedRegion("Coimbatore")
                .rationale("Forming regional cooperative for skilled carpenters")
                .build();

        when(workerRepository.findByUserId(workerUser.getId())).thenReturn(Optional.of(worker));
        when(cooperativeRepository.existsByRegistrationNumber(anyString())).thenReturn(false);

        CooperativeCreationRequest savedReq = CooperativeCreationRequest.builder()
                .worker(worker)
                .proposedName(dto.getProposedName())
                .proposedRegistrationNumber(dto.getProposedRegistrationNumber())
                .proposedRegion(dto.getProposedRegion())
                .rationale(dto.getRationale())
                .status(CooperativeRequestStatus.PENDING)
                .build();
        savedReq.setId(UUID.randomUUID());

        when(creationRequestRepository.save(any(CooperativeCreationRequest.class))).thenReturn(savedReq);

        CooperativeCreationRequestResponseDto response = affiliationService.submitCreationRequest(workerUser.getId(), dto);

        assertNotNull(response);
        assertEquals(CooperativeRequestStatus.PENDING, response.getStatus());
        assertEquals("Builders & Carpenters Labour Cooperative", response.getProposedName());
        verify(creationRequestRepository).save(any(CooperativeCreationRequest.class));
    }

    @Test
    @DisplayName("Option 1: Admin APPROVES Society Creation -> Worker becomes COOPERATIVE_MANAGER and AFFILIATED")
    void testOption1_AdminApproveCreationRequest() {
        UUID requestId = UUID.randomUUID();
        CooperativeCreationRequest request = CooperativeCreationRequest.builder()
                .worker(worker)
                .proposedName("Builders & Carpenters Labour Cooperative")
                .proposedRegistrationNumber("COOP-REQ-999")
                .proposedRegion("Coimbatore")
                .status(CooperativeRequestStatus.PENDING)
                .build();
        request.setId(requestId);

        when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));
        when(creationRequestRepository.findById(requestId)).thenReturn(Optional.of(request));

        LabourCooperative createdCoop = LabourCooperative.builder()
                .name(request.getProposedName())
                .registrationNumber(request.getProposedRegistrationNumber())
                .region(request.getProposedRegion())
                .createdByWorker(worker)
                .isActive(true)
                .build();
        createdCoop.setId(UUID.randomUUID());

        when(cooperativeRepository.save(any(LabourCooperative.class))).thenReturn(createdCoop);
        when(cooperativeManagerRepository.findByUserId(workerUser.getId())).thenReturn(Optional.empty());
        when(creationRequestRepository.save(any(CooperativeCreationRequest.class))).thenReturn(request);

        AdminReviewRequestDto reviewDto = AdminReviewRequestDto.builder()
                .status(CooperativeRequestStatus.APPROVED)
                .adminNotes("Society bylaws verified and approved.")
                .build();

        CooperativeCreationRequestResponseDto response = affiliationService.reviewCreationRequest(adminUser.getId(), requestId, reviewDto);

        assertNotNull(response);
        assertEquals(CooperativeRequestStatus.APPROVED, response.getStatus());
        assertEquals(UserRole.COOPERATIVE_MANAGER, workerUser.getRole(), "User role must be promoted to COOPERATIVE_MANAGER");
        assertEquals(AffiliationStatus.AFFILIATED, worker.getAffiliationStatus(), "Worker must now be AFFILIATED");
        assertTrue(worker.isAffiliated(), "Worker.isAffiliated() helper must return true");

        verify(cooperativeRepository).save(any(LabourCooperative.class));
        verify(cooperativeManagerRepository).save(any(CooperativeManager.class));
        verify(membershipRepository).save(any(CooperativeMembership.class));
    }

    @Test
    @DisplayName("Option 2: Worker joins existing society and Moderator APPROVES -> Worker becomes AFFILIATED")
    void testOption2_JoinExistingSocietyAndModeratorApprove() {
        JoinCooperativeRequestDto joinDto = JoinCooperativeRequestDto.builder()
                .cooperativeId(existingCoop.getId())
                .requestNotes("Certified plumber applying to join")
                .build();

        when(workerRepository.findByUserId(workerUser.getId())).thenReturn(Optional.of(worker));
        when(cooperativeRepository.findById(existingCoop.getId())).thenReturn(Optional.of(existingCoop));
        when(membershipRepository.existsByWorkerIdAndCooperativeIdAndStatus(worker.getId(), existingCoop.getId(), MembershipStatus.ACTIVE)).thenReturn(false);
        when(membershipRepository.existsByWorkerIdAndCooperativeIdAndStatus(worker.getId(), existingCoop.getId(), MembershipStatus.PENDING)).thenReturn(false);

        UUID membershipId = UUID.randomUUID();
        CooperativeMembership pendingMembership = CooperativeMembership.builder()
                .worker(worker)
                .cooperative(existingCoop)
                .joinDate(LocalDate.now())
                .status(MembershipStatus.PENDING)
                .requestNotes(joinDto.getRequestNotes())
                .build();
        pendingMembership.setId(membershipId);

        when(membershipRepository.save(any(CooperativeMembership.class))).thenReturn(pendingMembership);

        // 1. Submit join request
        MembershipResponseDto joinResponse = affiliationService.submitJoinRequest(workerUser.getId(), joinDto);
        assertNotNull(joinResponse);
        assertEquals(MembershipStatus.PENDING, joinResponse.getStatus());

        // 2. Moderator reviews and approves
        when(cooperativeManagerRepository.findByUserId(managerUser.getId())).thenReturn(Optional.of(manager));
        when(membershipRepository.findById(membershipId)).thenReturn(Optional.of(pendingMembership));

        ModeratorReviewRequestDto reviewDto = ModeratorReviewRequestDto.builder()
                .status(MembershipStatus.ACTIVE)
                .membershipNumber("APEX-MEM-204")
                .build();

        MembershipResponseDto approvalResponse = affiliationService.reviewMembership(managerUser.getId(), membershipId, reviewDto);

        assertNotNull(approvalResponse);
        assertEquals(MembershipStatus.ACTIVE, approvalResponse.getStatus());
        assertEquals("APEX-MEM-204", approvalResponse.getMembershipNumber());
        assertEquals(AffiliationStatus.AFFILIATED, worker.getAffiliationStatus());
        assertEquals(existingCoop, worker.getPrimaryCooperative());
        assertTrue(worker.isAffiliated(), "Worker must now be AFFILIATED with existing cooperative");
    }

    @Test
    @DisplayName("Affiliation Enforcement: isWorkerAffiliated returns false for unaffiliated worker")
    void testAffiliationEnforcement_UnaffiliatedWorker() {
        when(workerRepository.findById(worker.getId())).thenReturn(Optional.of(worker));

        boolean isAffiliated = affiliationService.isWorkerAffiliated(worker.getId());
        assertFalse(isAffiliated, "Unaffiliated worker cannot receive jobs or payments");
    }
}

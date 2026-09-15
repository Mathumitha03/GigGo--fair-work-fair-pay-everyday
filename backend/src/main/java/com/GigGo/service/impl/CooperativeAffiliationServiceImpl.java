package com.GigGo.service.impl;

import com.GigGo.dto.cooperative.AdminReviewRequestDto;
import com.GigGo.dto.cooperative.CooperativeCreationRequestResponseDto;
import com.GigGo.dto.cooperative.CooperativeResponseDto;
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
import com.GigGo.enums.WorkerVerificationStatus;
import com.GigGo.repository.CooperativeCreationRequestRepository;
import com.GigGo.repository.CooperativeManagerRepository;
import com.GigGo.repository.CooperativeMembershipRepository;
import com.GigGo.repository.LabourCooperativeRepository;
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.service.CooperativeAffiliationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CooperativeAffiliationServiceImpl implements CooperativeAffiliationService {

    private final CooperativeCreationRequestRepository creationRequestRepository;
    private final CooperativeMembershipRepository membershipRepository;
    private final LabourCooperativeRepository cooperativeRepository;
    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;
    private final CooperativeManagerRepository cooperativeManagerRepository;

    // =========================================================================
    // WORKER OPTION 1: Request New Cooperative Society Creation
    // =========================================================================

    @Override
    @Transactional
    public CooperativeCreationRequestResponseDto submitCreationRequest(UUID workerUserId, CreateCooperativeRequestDto dto) {
        Worker worker = getWorkerByUserId(workerUserId);

        if (cooperativeRepository.existsByRegistrationNumber(dto.getProposedRegistrationNumber().trim())) {
            throw new IllegalArgumentException("A cooperative society with registration number '" + dto.getProposedRegistrationNumber() + "' already exists");
        }

        CooperativeCreationRequest request = CooperativeCreationRequest.builder()
                .worker(worker)
                .proposedName(dto.getProposedName().trim())
                .proposedRegistrationNumber(dto.getProposedRegistrationNumber().trim())
                .proposedRegion(dto.getProposedRegion().trim())
                .proposedAddress(dto.getProposedAddress())
                .contactEmail(dto.getContactEmail())
                .contactPhone(dto.getContactPhone())
                .rationale(dto.getRationale())
                .supportingDocumentUrl(dto.getSupportingDocumentUrl())
                .status(CooperativeRequestStatus.PENDING)
                .build();

        request = creationRequestRepository.save(request);

        worker.setAffiliationStatus(AffiliationStatus.PENDING_AFFILIATION);
        workerRepository.save(worker);

        log.info("Worker {} submitted new cooperative creation request for '{}'", worker.getId(), dto.getProposedName());
        return mapToCreationRequestDto(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CooperativeCreationRequestResponseDto> getCreationRequests(CooperativeRequestStatus status) {
        List<CooperativeCreationRequest> list = (status != null)
                ? creationRequestRepository.findAllByStatus(status)
                : creationRequestRepository.findAll();

        return list.stream().map(this::mapToCreationRequestDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CooperativeCreationRequestResponseDto> getWorkerCreationRequests(UUID workerUserId) {
        Worker worker = getWorkerByUserId(workerUserId);
        return creationRequestRepository.findAllByWorkerId(worker.getId())
                .stream().map(this::mapToCreationRequestDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CooperativeCreationRequestResponseDto reviewCreationRequest(UUID adminUserId, UUID requestId, AdminReviewRequestDto dto) {
        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found"));

        CooperativeCreationRequest request = creationRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Cooperative creation request not found: " + requestId));

        if (request.getStatus() != CooperativeRequestStatus.PENDING) {
            throw new IllegalStateException("This creation request has already been reviewed with status: " + request.getStatus());
        }

        request.setReviewedBy(adminUser);
        request.setReviewedAt(Instant.now());
        request.setAdminNotes(dto.getAdminNotes());
        request.setStatus(dto.getStatus());

        Worker worker = request.getWorker();

        if (dto.getStatus() == CooperativeRequestStatus.APPROVED) {
            // 1. Create the LabourCooperative entity
            LabourCooperative newCoop = LabourCooperative.builder()
                    .name(request.getProposedName())
                    .registrationNumber(request.getProposedRegistrationNumber())
                    .region(request.getProposedRegion())
                    .address(request.getProposedAddress())
                    .contactEmail(request.getContactEmail())
                    .contactPhone(request.getContactPhone())
                    .commissionRate(new BigDecimal("5.00")) // default fair 5% retention
                    .welfareFundBalance(BigDecimal.ZERO)
                    .createdByWorker(worker)
                    .isActive(true)
                    .build();

            final LabourCooperative savedCooperative = cooperativeRepository.save(newCoop);
            request.setCreatedCooperative(savedCooperative);

            // 2. Promote worker/user to COOPERATIVE_MANAGER of this new society
            User user = worker.getUser();
            user.setRole(UserRole.COOPERATIVE_MANAGER);
            userRepository.save(user);

            CooperativeManager manager = cooperativeManagerRepository.findByUserId(user.getId())
                    .orElseGet(() -> CooperativeManager.builder()
                            .user(user)
                            .cooperative(savedCooperative)
                            .designation("Founding Society Manager / Secretary")
                            .employeeCode("MGR-" + savedCooperative.getRegistrationNumber().substring(0, Math.min(6, savedCooperative.getRegistrationNumber().length())))
                            .build());

            manager.setCooperative(savedCooperative);
            cooperativeManagerRepository.save(manager);

            // 3. Mark worker affiliated with this society
            worker.setPrimaryCooperative(savedCooperative);
            worker.setAffiliationStatus(AffiliationStatus.AFFILIATED);
            worker.setVerificationStatus(WorkerVerificationStatus.VERIFIED);
            String membershipNo = "COOP-" + System.currentTimeMillis() % 1000000;
            worker.setWelfareMemberId(membershipNo);
            workerRepository.save(worker);

            // 4. Create active membership record
            CooperativeMembership membership = CooperativeMembership.builder()
                    .worker(worker)
                    .cooperative(savedCooperative)
                    .joinDate(LocalDate.now())
                    .membershipNumber(membershipNo)
                    .status(MembershipStatus.ACTIVE)
                    .verifiedBy(manager)
                    .verifiedAt(Instant.now())
                    .requestNotes("Founding Society Member & Manager")
                    .build();

            membershipRepository.save(membership);

            log.info("Approved creation request {}. Created cooperative {} and promoted worker {} to manager.",
                    requestId, savedCooperative.getName(), worker.getId());
        } else {
            // Rejected
            worker.setAffiliationStatus(AffiliationStatus.UNAFFILIATED);
            workerRepository.save(worker);
            log.info("Rejected creation request {} for worker {}", requestId, worker.getId());
        }

        request = creationRequestRepository.save(request);
        return mapToCreationRequestDto(request);
    }

    // =========================================================================
    // WORKER OPTION 2: Request to Join Existing Cooperative Society
    // =========================================================================

    @Override
    @Transactional
    public MembershipResponseDto submitJoinRequest(UUID workerUserId, JoinCooperativeRequestDto dto) {
        Worker worker = getWorkerByUserId(workerUserId);

        LabourCooperative cooperative = cooperativeRepository.findById(dto.getCooperativeId())
                .orElseThrow(() -> new IllegalArgumentException("Cooperative society not found with ID: " + dto.getCooperativeId()));

        if (!cooperative.isActive()) {
            throw new IllegalStateException("Cannot join an inactive cooperative society");
        }

        // Check for existing active or pending membership
        if (membershipRepository.existsByWorkerIdAndCooperativeIdAndStatus(worker.getId(), cooperative.getId(), MembershipStatus.ACTIVE)) {
            throw new IllegalStateException("Worker is already an active member of this cooperative society");
        }

        if (membershipRepository.existsByWorkerIdAndCooperativeIdAndStatus(worker.getId(), cooperative.getId(), MembershipStatus.PENDING)) {
            throw new IllegalStateException("Worker already has a pending join request for this cooperative society");
        }

        CooperativeMembership membership = CooperativeMembership.builder()
                .worker(worker)
                .cooperative(cooperative)
                .joinDate(LocalDate.now())
                .status(MembershipStatus.PENDING)
                .requestNotes(dto.getRequestNotes())
                .build();

        membership = membershipRepository.save(membership);

        worker.setAffiliationStatus(AffiliationStatus.PENDING_AFFILIATION);
        workerRepository.save(worker);

        log.info("Worker {} submitted join request to cooperative {}", worker.getId(), cooperative.getName());
        return mapToMembershipDto(membership);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembershipResponseDto> getPendingMembershipsForManager(UUID managerUserId) {
        CooperativeManager manager = cooperativeManagerRepository.findByUserId(managerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Cooperative manager profile not found for user: " + managerUserId));

        return membershipRepository.findAllByCooperativeIdAndStatus(manager.getCooperative().getId(), MembershipStatus.PENDING)
                .stream().map(this::mapToMembershipDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MembershipResponseDto> getWorkerMemberships(UUID workerUserId) {
        Worker worker = getWorkerByUserId(workerUserId);
        return membershipRepository.findAllByWorkerId(worker.getId())
                .stream().map(this::mapToMembershipDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MembershipResponseDto reviewMembership(UUID managerUserId, UUID membershipId, ModeratorReviewRequestDto dto) {
        CooperativeManager manager = cooperativeManagerRepository.findByUserId(managerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Cooperative manager profile not found"));

        CooperativeMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new IllegalArgumentException("Membership request not found: " + membershipId));

        if (!membership.getCooperative().getId().equals(manager.getCooperative().getId())) {
            throw new IllegalStateException("You are only authorized to review requests for your assigned cooperative: " + manager.getCooperative().getName());
        }

        if (membership.getStatus() != MembershipStatus.PENDING) {
            throw new IllegalStateException("Membership request is not in PENDING state. Current status: " + membership.getStatus());
        }

        Worker worker = membership.getWorker();

        if (dto.getStatus() == MembershipStatus.ACTIVE) {
            String membershipNo = dto.getMembershipNumber() != null && !dto.getMembershipNumber().isBlank()
                    ? dto.getMembershipNumber().trim()
                    : "COOP-MEM-" + System.currentTimeMillis() % 1000000;

            membership.setStatus(MembershipStatus.ACTIVE);
            membership.setMembershipNumber(membershipNo);
            membership.setVerifiedBy(manager);
            membership.setVerifiedAt(Instant.now());

            // Worker is now officially AFFILIATED
            worker.setPrimaryCooperative(membership.getCooperative());
            worker.setAffiliationStatus(AffiliationStatus.AFFILIATED);
            worker.setVerificationStatus(WorkerVerificationStatus.VERIFIED);
            worker.setWelfareMemberId(membershipNo);
            workerRepository.save(worker);

            log.info("Manager {} approved worker {} into cooperative {}", manager.getId(), worker.getId(), membership.getCooperative().getName());
        } else if (dto.getStatus() == MembershipStatus.REJECTED) {
            membership.setStatus(MembershipStatus.REJECTED);
            membership.setRejectionReason(dto.getRejectionReason());
            membership.setVerifiedBy(manager);
            membership.setVerifiedAt(Instant.now());

            // If worker has no other active cooperative, mark UNAFFILIATED
            if (worker.getPrimaryCooperative() == null || worker.getPrimaryCooperative().getId().equals(membership.getCooperative().getId())) {
                worker.setAffiliationStatus(AffiliationStatus.UNAFFILIATED);
                workerRepository.save(worker);
            }

            log.info("Manager {} rejected worker {} join request", manager.getId(), worker.getId());
        } else {
            throw new IllegalArgumentException("Invalid review status. Expected ACTIVE or REJECTED, but received: " + dto.getStatus());
        }

        membership = membershipRepository.save(membership);
        return mapToMembershipDto(membership);
    }

    // =========================================================================
    // AFFILIATION ENFORCEMENT & CATALOG
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public boolean isWorkerAffiliated(UUID workerId) {
        return workerRepository.findById(workerId)
                .map(Worker::isAffiliated)
                .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CooperativeResponseDto> getAllActiveCooperatives() {
        return cooperativeRepository.findAllByIsActiveTrue()
                .stream().map(this::mapToCooperativeDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CooperativeResponseDto getCooperativeById(UUID cooperativeId) {
        LabourCooperative cooperative = cooperativeRepository.findById(cooperativeId)
                .orElseThrow(() -> new IllegalArgumentException("Cooperative society not found with ID: " + cooperativeId));
        return mapToCooperativeDto(cooperative);
    }

    // =========================================================================
    // HELPER MAPPERS
    // =========================================================================

    private Worker getWorkerByUserId(UUID userId) {
        return workerRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Worker profile not found for user: " + userId));
    }

    private CooperativeCreationRequestResponseDto mapToCreationRequestDto(CooperativeCreationRequest req) {
        return CooperativeCreationRequestResponseDto.builder()
                .id(req.getId())
                .workerId(req.getWorker().getId())
                .workerName(req.getWorker().getUser().getName())
                .workerPhone(req.getWorker().getUser().getPhone())
                .workerEmail(req.getWorker().getUser().getEmail())
                .proposedName(req.getProposedName())
                .proposedRegistrationNumber(req.getProposedRegistrationNumber())
                .proposedRegion(req.getProposedRegion())
                .proposedAddress(req.getProposedAddress())
                .contactEmail(req.getContactEmail())
                .contactPhone(req.getContactPhone())
                .rationale(req.getRationale())
                .supportingDocumentUrl(req.getSupportingDocumentUrl())
                .status(req.getStatus())
                .reviewedById(req.getReviewedBy() != null ? req.getReviewedBy().getId() : null)
                .reviewedByName(req.getReviewedBy() != null ? req.getReviewedBy().getName() : null)
                .reviewedAt(req.getReviewedAt())
                .adminNotes(req.getAdminNotes())
                .createdCooperativeId(req.getCreatedCooperative() != null ? req.getCreatedCooperative().getId() : null)
                .createdAt(req.getCreatedAt())
                .build();
    }

    private MembershipResponseDto mapToMembershipDto(CooperativeMembership mem) {
        return MembershipResponseDto.builder()
                .id(mem.getId())
                .workerId(mem.getWorker().getId())
                .workerName(mem.getWorker().getUser().getName())
                .workerPhone(mem.getWorker().getUser().getPhone())
                .workerEmail(mem.getWorker().getUser().getEmail())
                .workerSkills(mem.getWorker().getSkills())
                .cooperativeId(mem.getCooperative().getId())
                .cooperativeName(mem.getCooperative().getName())
                .membershipNumber(mem.getMembershipNumber())
                .status(mem.getStatus())
                .joinDate(mem.getJoinDate())
                .requestNotes(mem.getRequestNotes())
                .rejectionReason(mem.getRejectionReason())
                .verifiedById(mem.getVerifiedBy() != null ? mem.getVerifiedBy().getId() : null)
                .verifiedByName(mem.getVerifiedBy() != null ? mem.getVerifiedBy().getUser().getName() : null)
                .verifiedAt(mem.getVerifiedAt())
                .createdAt(mem.getCreatedAt())
                .build();
    }

    private CooperativeResponseDto mapToCooperativeDto(LabourCooperative coop) {
        return CooperativeResponseDto.builder()
                .id(coop.getId())
                .name(coop.getName())
                .registrationNumber(coop.getRegistrationNumber())
                .region(coop.getRegion())
                .address(coop.getAddress())
                .contactEmail(coop.getContactEmail())
                .contactPhone(coop.getContactPhone())
                .description(coop.getDescription())
                .commissionRate(coop.getCommissionRate())
                .welfareFundBalance(coop.getWelfareFundBalance())
                .insuranceSchemeDetails(coop.getInsuranceSchemeDetails())
                .isActive(coop.isActive())
                .createdByWorkerId(coop.getCreatedByWorker() != null ? coop.getCreatedByWorker().getId() : null)
                .createdByWorkerName(coop.getCreatedByWorker() != null ? coop.getCreatedByWorker().getUser().getName() : null)
                .createdAt(coop.getCreatedAt())
                .build();
    }
}

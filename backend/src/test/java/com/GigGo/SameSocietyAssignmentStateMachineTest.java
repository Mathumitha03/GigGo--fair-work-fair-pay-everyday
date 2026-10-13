package com.GigGo;

import com.GigGo.controller.WorkerAssignmentController;
import com.GigGo.dto.booking.BookingResponseDto;
import com.GigGo.dto.booking.CreateServiceRequestDto;
import com.GigGo.dto.booking.RespondAssignmentDto;
import com.GigGo.dto.booking.ServiceRequestResponseDto;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.booking.Assignment;
import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.booking.BookingStatusHistory;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.Customer;
import com.GigGo.entity.profile.Worker;
import com.GigGo.entity.service.ServiceCategory;
import com.GigGo.entity.service.ServiceProblem;
import com.GigGo.enums.AssignmentStatus;
import com.GigGo.enums.BookingStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.enums.WorkerVerificationStatus;
import com.GigGo.repository.AssignmentRepository;
import com.GigGo.repository.BookingRepository;
import com.GigGo.repository.BookingStatusHistoryRepository;
import com.GigGo.repository.CustomerRepository;
import com.GigGo.repository.LabourCooperativeRepository;
import com.GigGo.repository.ServiceCategoryRepository;
import com.GigGo.repository.ServiceOfferingRepository;
import com.GigGo.repository.ServiceProblemRepository;
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.service.WorkerNotificationService;
import com.GigGo.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class SameSocietyAssignmentStateMachineTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private BookingStatusHistoryRepository bookingStatusHistoryRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private WorkerRepository workerRepository;

    @Mock
    private LabourCooperativeRepository cooperativeRepository;

    @Mock
    private ServiceCategoryRepository serviceCategoryRepository;

    @Mock
    private ServiceProblemRepository serviceProblemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ServiceOfferingRepository serviceOfferingRepository;

    @Mock
    private WorkerNotificationService workerNotificationService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    // Test fixtures
    private LabourCooperative societyA;
    private LabourCooperative societyB;

    private User customerUser;
    private Customer customer;

    private User workerUserA1;
    private Worker workerA1; // Carpenter in Society A

    private User workerUserA2;
    private Worker workerA2; // Carpenter in Society A

    private User workerUserB;
    private Worker workerB; // Carpenter in Society B (Cross-society)

    private User painterUserA;
    private Worker painterWorkerA; // Painter in Society A

    private ServiceCategory carpenterCategory;
    private ServiceCategory painterCategory;

    private ServiceProblem carpenterProblem;

    @BeforeEach
    void setUp() {
        societyA = LabourCooperative.builder()
                .id(UUID.randomUUID())
                .name("Society A (Chennai Central)")
                .registrationNumber("SOC-A-100")
                .region("Chennai")
                .isActive(true)
                .build();

        societyB = LabourCooperative.builder()
                .id(UUID.randomUUID())
                .name("Society B (Coimbatore South)")
                .registrationNumber("SOC-B-200")
                .region("Coimbatore")
                .isActive(true)
                .build();

        // Customer in Society A
        customerUser = User.builder()
                .id(UUID.randomUUID())
                .name("Ramesh Customer")
                .email("ramesh@example.com")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        customer = Customer.builder()
                .id(UUID.randomUUID())
                .user(customerUser)
                .cooperative(societyA)
                .build();

        // Worker A1: Carpenter in Society A
        workerUserA1 = User.builder()
                .id(UUID.randomUUID())
                .name("worker101_A")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();

        workerA1 = Worker.builder()
                .id(UUID.randomUUID())
                .user(workerUserA1)
                .primaryCooperative(societyA)
                .verificationStatus(WorkerVerificationStatus.VERIFIED)
                .isAvailable(true)
                .skills("Carpenter, Woodworking")
                .cooperativeWorkerId("TN-101")
                .rotationWeight(BigDecimal.ONE)
                .build();

        // Worker A2: Carpenter in Society A
        workerUserA2 = User.builder()
                .id(UUID.randomUUID())
                .name("worker102_A")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();

        workerA2 = Worker.builder()
                .id(UUID.randomUUID())
                .user(workerUserA2)
                .primaryCooperative(societyA)
                .verificationStatus(WorkerVerificationStatus.VERIFIED)
                .isAvailable(true)
                .skills("Carpenter, Furniture repair")
                .cooperativeWorkerId("TN-102")
                .rotationWeight(BigDecimal.ONE)
                .build();

        // Worker B: Carpenter in Society B (Cross-society worker)
        workerUserB = User.builder()
                .id(UUID.randomUUID())
                .name("worker103_B")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();

        workerB = Worker.builder()
                .id(UUID.randomUUID())
                .user(workerUserB)
                .primaryCooperative(societyB)
                .verificationStatus(WorkerVerificationStatus.VERIFIED)
                .isAvailable(true)
                .skills("Carpenter")
                .cooperativeWorkerId("TN-103")
                .rotationWeight(BigDecimal.ONE)
                .build();

        // Worker A3: Painter in Society A (Different service)
        painterUserA = User.builder()
                .id(UUID.randomUUID())
                .name("worker104_Painter")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();

        painterWorkerA = Worker.builder()
                .id(UUID.randomUUID())
                .user(painterUserA)
                .primaryCooperative(societyA)
                .verificationStatus(WorkerVerificationStatus.VERIFIED)
                .isAvailable(true)
                .skills("Painter, Wall finishing")
                .cooperativeWorkerId("TN-104")
                .rotationWeight(BigDecimal.ONE)
                .build();

        carpenterCategory = ServiceCategory.builder()
                .id(UUID.randomUUID())
                .name("Carpenter")
                .slug("carpenter")
                .basePrice(new BigDecimal("350.00"))
                .build();

        painterCategory = ServiceCategory.builder()
                .id(UUID.randomUUID())
                .name("Painter")
                .slug("painter")
                .basePrice(new BigDecimal("400.00"))
                .build();

        carpenterProblem = ServiceProblem.builder()
                .id(UUID.randomUUID())
                .category(carpenterCategory)
                .name("Door Lock Repair")
                .estimatedPrice(new BigDecimal("350.00"))
                .build();

        when(customerRepository.findByUserId(customerUser.getId())).thenReturn(Optional.of(customer));
        when(serviceProblemRepository.findById(carpenterProblem.getId())).thenReturn(Optional.of(carpenterProblem));
        when(workerRepository.findByUserId(workerUserA1.getId())).thenReturn(Optional.of(workerA1));
        when(workerRepository.findByUserId(workerUserA2.getId())).thenReturn(Optional.of(workerA2));
        when(workerRepository.findByUserId(workerUserB.getId())).thenReturn(Optional.of(workerB));
        when(workerRepository.findByUserId(painterUserA.getId())).thenReturn(Optional.of(painterWorkerA));

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            if (b.getId() == null) b.setId(UUID.randomUUID());
            when(bookingRepository.findById(b.getId())).thenReturn(Optional.of(b));
            when(bookingRepository.findByIdWithLock(b.getId())).thenReturn(Optional.of(b));
            return b;
        });

        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(invocation -> {
            Assignment a = invocation.getArgument(0);
            if (a.getId() == null) a.setId(UUID.randomUUID());
            if (a.getBooking() != null && a.getBooking().getId() != null) {
                when(assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(a.getBooking().getId(), a.getStatus()))
                        .thenReturn(Optional.of(a));
            }
            return a;
        });
    }

    // =========================================================================
    // TEST 1 — Same-society worker
    // Customer belongs to SOCIETY_A. An eligible CARPENTER worker belongs to SOCIETY_A.
    // Expected: the request is offered to that worker.
    // =========================================================================
    @Test
    @DisplayName("TEST 1: Customer in SOCIETY_A is matched with eligible CARPENTER worker in same SOCIETY_A")
    void test1_SameSocietyWorker_DispatchedCorrectly() {
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(List.of(workerA1, workerA2));

        CreateServiceRequestDto requestDto = CreateServiceRequestDto.builder()
                .problemId(carpenterProblem.getId())
                .latitude(13.0827)
                .longitude(80.2707)
                .build();

        ServiceRequestResponseDto initialResponse = bookingService.createServiceRequest(customerUser.getId(), requestDto);

        assertNotNull(initialResponse);
        assertNotNull(initialResponse.getRequestId());
        assertEquals("WAITING_FOR_WORKER", initialResponse.getStatus());

        // Verify assignment saved with 30s expiration and offered to workerA1
        ArgumentCaptor<Assignment> assignmentCaptor = ArgumentCaptor.forClass(Assignment.class);
        verify(assignmentRepository, atLeastOnce()).save(assignmentCaptor.capture());

        Assignment offeredAssignment = assignmentCaptor.getAllValues().get(0);
        assertEquals(workerA1.getId(), offeredAssignment.getWorker().getId());
        assertEquals(AssignmentStatus.OFFERED, offeredAssignment.getStatus());
        assertEquals(1, offeredAssignment.getRank());
        assertNotNull(offeredAssignment.getExpiresAt());
        assertTrue(offeredAssignment.getExpiresAt().isAfter(Instant.now()));

        // Verify worker notification dispatched
        verify(workerNotificationService, atLeastOnce()).notifyWorkerOfOffer(eq(workerA1), any(Booking.class), eq(offeredAssignment));

        // When retrieving request status API:
        ServiceRequestResponseDto liveStatus = bookingService.getServiceRequestById(initialResponse.getRequestId(), customerUser.getId());
        assertEquals("WAITING_FOR_WORKER", liveStatus.getStatus());
        assertNotNull(liveStatus.getAssignedWorker());
        assertEquals("TN-101", liveStatus.getAssignedWorker().getWorkerId());
        assertNotNull(liveStatus.getOfferExpiresAt());
    }

    // =========================================================================
    // TEST 2 — Cross-society protection
    // Customer belongs to SOCIETY_A. A CARPENTER worker belongs to SOCIETY_B.
    // Expected: that worker never receives the request.
    // =========================================================================
    @Test
    @DisplayName("TEST 2: CARPENTER worker in SOCIETY_B is strictly excluded from customer request in SOCIETY_A")
    void test2_CrossSocietyProtection_ExcludesSocietyBWorkers() {
        // Only workerB in society B exists
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(Collections.emptyList());

        CreateServiceRequestDto requestDto = CreateServiceRequestDto.builder()
                .problemId(carpenterProblem.getId())
                .latitude(13.0827)
                .longitude(80.2707)
                .build();

        ServiceRequestResponseDto initialResponse = bookingService.createServiceRequest(customerUser.getId(), requestDto);
        assertNotNull(initialResponse);

        // Status via API reveals NO_WORKER_AVAILABLE
        ServiceRequestResponseDto liveStatus = bookingService.getServiceRequestById(initialResponse.getRequestId(), customerUser.getId());
        assertEquals("NO_WORKER_AVAILABLE", liveStatus.getStatus());
        assertNull(liveStatus.getAssignedWorker());

        // Worker B in Society B must NEVER have been saved in an assignment
        ArgumentCaptor<Assignment> assignmentCaptor = ArgumentCaptor.forClass(Assignment.class);
        verify(assignmentRepository, never()).save(any(Assignment.class));
        verify(workerNotificationService, never()).notifyWorkerOfOffer(eq(workerB), any(), any());
    }

    // =========================================================================
    // TEST 3 — Service matching
    // Customer requests CARPENTER. A same-society worker only provides PAINTER.
    // Expected: that worker is not eligible.
    // =========================================================================
    @Test
    @DisplayName("TEST 3: Same-society worker providing PAINTER is not eligible for CARPENTER request")
    void test3_ServiceMatching_ExcludesUnmatchedSkills() {
        // Society A query returns painterWorkerA
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(List.of(painterWorkerA));

        CreateServiceRequestDto requestDto = CreateServiceRequestDto.builder()
                .problemId(carpenterProblem.getId())
                .latitude(13.0827)
                .longitude(80.2707)
                .build();

        ServiceRequestResponseDto initialResponse = bookingService.createServiceRequest(customerUser.getId(), requestDto);
        assertNotNull(initialResponse);

        // Filtered out because painter != carpenter
        ServiceRequestResponseDto liveStatus = bookingService.getServiceRequestById(initialResponse.getRequestId(), customerUser.getId());
        assertEquals("NO_WORKER_AVAILABLE", liveStatus.getStatus());
        assertNull(liveStatus.getAssignedWorker());

        verify(assignmentRepository, never()).save(any(Assignment.class));
        verify(workerNotificationService, never()).notifyWorkerOfOffer(eq(painterWorkerA), any(), any());
    }

    // =========================================================================
    // TEST 4 — Worker acceptance
    // The currently assigned worker accepts before the deadline.
    // Expected: request status becomes ACCEPTED, and no further worker is contacted.
    // =========================================================================
    @Test
    @DisplayName("TEST 4: Worker accepts offer within 30s deadline; transitions to ACCEPTED and stops dispatching")
    void test4_WorkerAcceptance_TransitionsToAccepted() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-REQ-001")
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        Assignment assignment1 = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now().minusSeconds(10))
                .expiresAt(Instant.now().plusSeconds(20))
                .rank(1)
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(bookingId, AssignmentStatus.OFFERED))
                .thenReturn(Optional.of(assignment1));
        when(assignmentRepository.findById(assignment1.getId())).thenReturn(Optional.of(assignment1));

        RespondAssignmentDto acceptDto = RespondAssignmentDto.builder().accept(true).build();
        bookingService.respondToRequest(workerUserA1.getId(), bookingId, acceptDto);

        assertEquals(AssignmentStatus.ACCEPTED, assignment1.getStatus());
        assertEquals(BookingStatus.ACCEPTED, booking.getStatus());
        assertEquals(workerA1.getId(), booking.getAssignedWorker().getId());

        // Verify assignment saved as ACCEPTED
        verify(assignmentRepository).save(assignment1);
        verify(bookingRepository).save(booking);

        // Verify no next worker contacted
        verify(workerRepository, never()).findEligibleWorkersByCooperativeSorted(any());
    }

    // =========================================================================
    // TEST 5 — Worker rejection
    // The currently assigned worker rejects.
    // Expected: the next eligible worker in the same society receives the request immediately.
    // =========================================================================
    @Test
    @DisplayName("TEST 5: Worker rejects offer; attempt marked REJECTED and next same-society worker dispatched immediately")
    void test5_WorkerRejection_DispatchesNextEligibleWorkerImmediately() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-REQ-002")
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        Assignment assignment1 = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now().minusSeconds(10))
                .expiresAt(Instant.now().plusSeconds(20))
                .rank(1)
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(bookingId, AssignmentStatus.OFFERED))
                .thenReturn(Optional.of(assignment1));
        when(assignmentRepository.findById(assignment1.getId())).thenReturn(Optional.of(assignment1));

        // When dispatching next worker:
        when(assignmentRepository.findByBookingId(bookingId)).thenReturn(List.of(assignment1));
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(List.of(workerA1, workerA2));

        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RespondAssignmentDto rejectDto = RespondAssignmentDto.builder().accept(false).build();
        bookingService.respondToRequest(workerUserA1.getId(), bookingId, rejectDto);

        // Worker 1's assignment is REJECTED
        assertEquals(AssignmentStatus.REJECTED, assignment1.getStatus());

        // Booking is still WAITING_FOR_WORKER with workerA2 now assigned
        assertEquals(BookingStatus.WAITING_FOR_WORKER, booking.getStatus());
        assertEquals(workerA2.getId(), booking.getAssignedWorker().getId());

        // Verify assignment for workerA2 was created (rank 2)
        ArgumentCaptor<Assignment> captor = ArgumentCaptor.forClass(Assignment.class);
        verify(assignmentRepository, atLeastOnce()).save(captor.capture());

        List<Assignment> saved = captor.getAllValues();
        assertTrue(saved.stream().anyMatch(a -> a.getWorker().getId().equals(workerA2.getId()) && a.getStatus() == AssignmentStatus.OFFERED && a.getRank() == 2));
    }

    // =========================================================================
    // TEST 6 — Timeout
    // The worker does not respond within 30 seconds.
    // Expected: the attempt becomes TIMED_OUT and the next eligible worker in the same society receives the request.
    // =========================================================================
    @Test
    @DisplayName("TEST 6: 30s timeout marks offer TIMED_OUT and dispatches next same-society worker using controllable clock")
    void test6_Timeout_DispatchesNextEligibleWorkerAfter30Seconds() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-REQ-003")
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        Instant offerTime = Instant.now().minusSeconds(35);
        Assignment expiredAssignment = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(offerTime)
                .expiresAt(offerTime.plusSeconds(30)) // Expired 5 seconds ago
                .rank(1)
                .build();

        Instant simulatedNow = Instant.now();

        when(assignmentRepository.findExpiredAssignmentsWithNow(eq(AssignmentStatus.OFFERED), any(Instant.class), eq(simulatedNow)))
                .thenReturn(List.of(expiredAssignment));
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findByBookingId(bookingId)).thenReturn(List.of(expiredAssignment));
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(List.of(workerA1, workerA2));

        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Execute controllable timeout processing
        bookingService.expirePendingOffersAndDispatchNext(simulatedNow);

        // Expired assignment is marked TIMED_OUT
        assertEquals(AssignmentStatus.TIMED_OUT, expiredAssignment.getStatus());

        // Worker 2 in same society receives attempt #2
        ArgumentCaptor<Assignment> captor = ArgumentCaptor.forClass(Assignment.class);
        verify(assignmentRepository, atLeastOnce()).save(captor.capture());

        List<Assignment> saved = captor.getAllValues();
        assertTrue(saved.stream().anyMatch(a -> a.getWorker().getId().equals(workerA2.getId()) && a.getStatus() == AssignmentStatus.OFFERED && a.getRank() == 2));
    }

    // =========================================================================
    // TEST 7 — No eligible workers
    // No eligible same-society worker exists.
    // Expected: NO_WORKER_AVAILABLE. No cross-society worker is contacted.
    // =========================================================================
    @Test
    @DisplayName("TEST 7: No eligible workers in society sets NO_WORKER_AVAILABLE and never contacts other societies")
    void test7_NoEligibleWorkers_TransitionsToNoWorkerAvailable() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.REQUESTED)
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findByBookingId(bookingId)).thenReturn(Collections.emptyList());

        // Empty list in Society A
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(Collections.emptyList());

        boolean dispatched = bookingService.dispatchNextWorker(bookingId);

        assertFalse(dispatched);
        assertEquals(BookingStatus.NO_WORKER_AVAILABLE, booking.getStatus());
        assertNull(booking.getAssignedWorker());

        verify(assignmentRepository, never()).save(any(Assignment.class));
        verify(workerRepository, never()).findEligibleWorkersByCooperativeSorted(eq(societyB.getId()));
    }

    // =========================================================================
    // TEST 8 — Late acceptance
    // The first worker's offer expires and a second worker receives the request. The first worker then tries to accept.
    // Expected: the expired acceptance is rejected and the second active offer remains valid.
    // =========================================================================
    @Test
    @DisplayName("TEST 8: Late acceptance by expired worker is rejected; active second offer remains intact")
    void test8_LateAcceptance_RejectedWhenOfferExpiredOrDispatchedToNext() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        Assignment expiredAssignment1 = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1)
                .status(AssignmentStatus.TIMED_OUT)
                .assignedAt(Instant.now().minusSeconds(40))
                .expiresAt(Instant.now().minusSeconds(10))
                .rank(1)
                .build();

        Assignment activeAssignment2 = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA2)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now().minusSeconds(5))
                .expiresAt(Instant.now().plusSeconds(25))
                .rank(2)
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        // Active offer in DB is now assignment 2 (workerA2)
        when(assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(bookingId, AssignmentStatus.OFFERED))
                .thenReturn(Optional.of(activeAssignment2));
        when(assignmentRepository.findById(expiredAssignment1.getId())).thenReturn(Optional.of(expiredAssignment1));

        RespondAssignmentDto acceptDto = RespondAssignmentDto.builder().accept(true).build();

        // Worker A1 attempts to respond to request (which is now offered to worker A2) -> AccessDeniedException
        assertThrows(AccessDeniedException.class, () ->
                bookingService.respondToRequest(workerUserA1.getId(), bookingId, acceptDto)
        );

        // Worker A1 attempts to respond via old assignment ID -> IllegalStateException (not in OFFERED status)
        assertThrows(IllegalStateException.class, () ->
                bookingService.respondToAssignment(workerUserA1.getId(), expiredAssignment1.getId(), acceptDto)
        );

        // Active offer for workerA2 remains valid
        assertEquals(AssignmentStatus.OFFERED, activeAssignment2.getStatus());
        assertEquals(BookingStatus.WAITING_FOR_WORKER, booking.getStatus());
    }

    // =========================================================================
    // TEST 9 — Duplicate acceptance
    // Two workers or duplicate requests attempt to accept the same request concurrently.
    // Expected: at most one worker can successfully accept.
    // =========================================================================
    @Test
    @DisplayName("TEST 9: Duplicate acceptance prevented; second attempt throws IllegalStateException")
    void test9_DuplicateAcceptance_PreventedByLockingAndStateChecks() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        Assignment assignment = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now().minusSeconds(5))
                .expiresAt(Instant.now().plusSeconds(25))
                .rank(1)
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(bookingId, AssignmentStatus.OFFERED))
                .thenReturn(Optional.of(assignment));

        RespondAssignmentDto acceptDto = RespondAssignmentDto.builder().accept(true).build();

        // First acceptance succeeds
        bookingService.respondToRequest(workerUserA1.getId(), bookingId, acceptDto);
        assertEquals(BookingStatus.ACCEPTED, booking.getStatus());
        assertEquals(AssignmentStatus.ACCEPTED, assignment.getStatus());

        // Second acceptance attempt on already-accepted request
        IllegalStateException exception = assertThrows(IllegalStateException.class, () ->
                bookingService.respondToRequest(workerUserA1.getId(), bookingId, acceptDto)
        );
        assertTrue(exception.getMessage().contains("already been accepted"));
    }

    // =========================================================================
    // TEST 10 — Customer cancellation
    // The customer cancels while a worker offer is active.
    // Expected: the request becomes CANCELLED and no subsequent worker is offered the request.
    // =========================================================================
    @Test
    @DisplayName("TEST 10: Customer cancels active request; invalidates offer and blocks late worker acceptance")
    void test10_CustomerCancellation_InvalidatesOfferAndHaltsDispatch() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-CANCEL-001")
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        Assignment activeOffer = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now().minusSeconds(5))
                .expiresAt(Instant.now().plusSeconds(25))
                .rank(1)
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findByBookingIdAndStatus(bookingId, AssignmentStatus.OFFERED))
                .thenReturn(List.of(activeOffer));

        // Customer cancels request
        ServiceRequestResponseDto cancelResponse = bookingService.cancelServiceRequest(bookingId, customerUser.getId());

        assertEquals("CANCELLED", cancelResponse.getStatus());
        assertEquals(BookingStatus.CANCELLED, booking.getStatus());
        assertEquals(AssignmentStatus.CANCELLED, activeOffer.getStatus());

        // Now if worker attempts to respond to cancelled request -> IllegalStateException
        RespondAssignmentDto acceptDto = RespondAssignmentDto.builder().accept(true).build();
        assertThrows(IllegalStateException.class, () ->
                bookingService.respondToRequest(workerUserA1.getId(), bookingId, acceptDto)
        );

        // And dispatchNextWorker returns false on cancelled request
        assertFalse(bookingService.dispatchNextWorker(bookingId));
    }

    // =========================================================================
    // TEST 11 — Authorization
    // Unauthenticated user: 401.
    // CUSTOMER calling worker accept/reject endpoint: 403.
    // MANAGER calling worker accept/reject endpoint: 403.
    // Worker responding to another worker's offer: rejected.
    // =========================================================================
    @Test
    @DisplayName("TEST 11: Strict role-based authorization enforced across all endpoints and actions")
    void test11_Authorization_EnforcesRolesAndCrossWorkerProtection() throws NoSuchMethodException {
        // Sub-test 11A: Worker cannot respond to another worker's offer
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .customer(customer)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        Assignment offerToWorkerA1 = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1) // Offered to workerA1
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(30))
                .rank(1)
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(bookingId, AssignmentStatus.OFFERED))
                .thenReturn(Optional.of(offerToWorkerA1));

        RespondAssignmentDto acceptDto = RespondAssignmentDto.builder().accept(true).build();

        // Worker A2 attempts to respond to Worker A1's offer -> AccessDeniedException
        AccessDeniedException ex = assertThrows(AccessDeniedException.class, () ->
                bookingService.respondToRequest(workerUserA2.getId(), bookingId, acceptDto)
        );
        assertTrue(ex.getMessage().contains("not authorized to respond to another worker's offer"));

        // Sub-test 11B: Customer user calling worker endpoint in service -> AccessDeniedException
        assertThrows(AccessDeniedException.class, () ->
                bookingService.respondToRequest(customerUser.getId(), bookingId, acceptDto)
        );

        // Sub-test 11C: Controller annotations verify strictly WORKER role required (403 for CUSTOMER/MANAGER)
        Method acceptRequestMethod = WorkerAssignmentController.class.getMethod("acceptRequest", com.GigGo.security.UserPrincipal.class, UUID.class);
        PreAuthorize acceptAuth = acceptRequestMethod.getAnnotation(PreAuthorize.class);
        assertNotNull(acceptAuth);
        assertEquals("hasRole('WORKER')", acceptAuth.value());

        Method rejectRequestMethod = WorkerAssignmentController.class.getMethod("rejectRequest", com.GigGo.security.UserPrincipal.class, UUID.class);
        PreAuthorize rejectAuth = rejectRequestMethod.getAnnotation(PreAuthorize.class);
        assertNotNull(rejectAuth);
        assertEquals("hasRole('WORKER')", rejectAuth.value());

        Method respondRequestMethod = WorkerAssignmentController.class.getMethod("respondToRequest", com.GigGo.security.UserPrincipal.class, UUID.class, RespondAssignmentDto.class);
        PreAuthorize respondAuth = respondRequestMethod.getAnnotation(PreAuthorize.class);
        assertNotNull(respondAuth);
        assertEquals("hasRole('WORKER')", respondAuth.value());
    }

    // =========================================================================
    // TEST 12 — Restart recovery
    // An application restart occurs while an offer is pending.
    // Expected: the persisted expiration timestamp allows the backend to resume timeout processing correctly.
    // =========================================================================
    @Test
    @DisplayName("TEST 12: Restart recovery correctly resumes expired offers from persisted DB expiration timestamps")
    void test12_RestartRecovery_ResumesTimeoutProcessingFromPersistedTimestamps() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-RESTART-001")
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        // Persisted before app restart: offer was created 40s ago, expired 10s ago
        Instant createdBeforeRestart = Instant.now().minusSeconds(40);
        Instant expiredBeforeRestart = createdBeforeRestart.plusSeconds(30);

        Assignment preRestartAssignment = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(createdBeforeRestart)
                .expiresAt(expiredBeforeRestart)
                .rank(1)
                .build();

        Instant startupNow = Instant.now();

        // On reboot, scheduled scan runs query for persisted expired offers
        when(assignmentRepository.findExpiredAssignmentsWithNow(eq(AssignmentStatus.OFFERED), any(Instant.class), eq(startupNow)))
                .thenReturn(List.of(preRestartAssignment));
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findByBookingId(bookingId)).thenReturn(List.of(preRestartAssignment));
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(List.of(workerA1, workerA2));

        // Application restarts and runs scheduled scanner
        bookingService.expirePendingOffersAndDispatchNext(startupNow);

        // Verified pre-restart assignment recovers and transitions to TIMED_OUT
        assertEquals(AssignmentStatus.TIMED_OUT, preRestartAssignment.getStatus());

        // And dispatch resumes, selecting next worker in society A
        ArgumentCaptor<Assignment> captor = ArgumentCaptor.forClass(Assignment.class);
        verify(assignmentRepository, atLeastOnce()).save(captor.capture());

        List<Assignment> saved = captor.getAllValues();
        assertTrue(saved.stream().anyMatch(a -> a.getWorker().getId().equals(workerA2.getId()) && a.getStatus() == AssignmentStatus.OFFERED));
    }

    // =========================================================================
    // TEST 13 — Worker accepts using Problem ID directly as requestId
    // The user passes the problem's ID (e.g. from /services/{serviceId}/problems).
    // Expected: Request is resolved and accepted successfully.
    // =========================================================================
    @Test
    @DisplayName("TEST 13: Worker can respond using Problem ID directly in place of requestId")
    void test13_WorkerRespondsUsingProblemIdDirectly() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-PROB-001")
                .customer(customer)
                .serviceCategory(carpenterCategory)
                .serviceProblem(carpenterProblem)
                .status(BookingStatus.WAITING_FOR_WORKER)
                .build();

        Assignment assignment1 = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(workerA1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now().minusSeconds(5))
                .expiresAt(Instant.now().plusSeconds(25))
                .rank(1)
                .build();

        UUID problemId = carpenterProblem.getId();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.findByIdWithLock(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findFirstByBookingIdAndStatusOrderByAssignedAtDesc(bookingId, AssignmentStatus.OFFERED))
                .thenReturn(Optional.of(assignment1));
        when(assignmentRepository.findByWorkerIdAndStatusAndProblemId(workerA1.getId(), AssignmentStatus.OFFERED, problemId))
                .thenReturn(List.of(assignment1));
        when(bookingRepository.findByServiceProblemIdOrderByCreatedAtDesc(problemId))
                .thenReturn(List.of(booking));

        RespondAssignmentDto acceptDto = RespondAssignmentDto.builder().accept(true).build();

        // Worker calls respondToRequest passing problemId directly as the requestId parameter
        BookingResponseDto result = bookingService.respondToRequest(workerUserA1.getId(), problemId, acceptDto);

        assertNotNull(result);
        assertEquals(BookingStatus.ACCEPTED, booking.getStatus());
        assertEquals(AssignmentStatus.ACCEPTED, assignment1.getStatus());
        assertEquals(workerA1.getId(), booking.getAssignedWorker().getId());
    }
}

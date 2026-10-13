package com.GigGo;

import com.GigGo.dto.booking.AssignmentResponseDto;
import com.GigGo.dto.booking.BookingResponseDto;
import com.GigGo.dto.booking.CreateBookingRequestDto;
import com.GigGo.dto.booking.RespondAssignmentDto;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.booking.Assignment;
import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.booking.BookingStatusHistory;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.Customer;
import com.GigGo.entity.profile.Worker;
import com.GigGo.entity.service.ServiceCategory;
import com.GigGo.enums.AssignmentStatus;
import com.GigGo.enums.BookingStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.repository.AssignmentRepository;
import com.GigGo.repository.BookingRepository;
import com.GigGo.repository.BookingStatusHistoryRepository;
import com.GigGo.repository.CustomerRepository;
import com.GigGo.repository.LabourCooperativeRepository;
import com.GigGo.repository.ServiceCategoryRepository;
import com.GigGo.repository.ServiceOfferingRepository;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

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
    private UserRepository userRepository;

    @Mock
    private ServiceOfferingRepository serviceOfferingRepository;

    @Mock
    private WorkerNotificationService workerNotificationService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private LabourCooperative societyA;
    private LabourCooperative societyB;
    private LabourCooperative societyC;

    private User customerUser;
    private Customer customer;

    private User workerUser1;
    private Worker worker1;

    private User workerUser2;
    private Worker worker2;

    private User workerUser3;
    private Worker worker3;

    private ServiceCategory plumbingCategory;

    @BeforeEach
    void setUp() {
        societyA = LabourCooperative.builder()
                .id(UUID.randomUUID())
                .name("Society A")
                .registrationNumber("REG-A")
                .region("Region A")
                .isActive(true)
                .build();

        societyB = LabourCooperative.builder()
                .id(UUID.randomUUID())
                .name("Society B")
                .registrationNumber("REG-B")
                .region("Region B")
                .isActive(true)
                .build();

        societyC = LabourCooperative.builder()
                .id(UUID.randomUUID())
                .name("Society C")
                .registrationNumber("REG-C")
                .region("Region C")
                .isActive(true)
                .build();

        customerUser = User.builder()
                .id(UUID.randomUUID())
                .name("Customer 123")
                .username("customer123")
                .email("customer123@giggo.coop")
                .phone("9990001111")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        customer = Customer.builder()
                .id(UUID.randomUUID())
                .user(customerUser)
                .cooperative(societyA) // Customer belongs to Society A
                .defaultAddress("123 Society Street")
                .build();

        // Worker 1 -> Society A -> Logged In / Available
        workerUser1 = User.builder()
                .id(UUID.randomUUID())
                .name("Worker 1")
                .username("worker1")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();

        worker1 = Worker.builder()
                .id(UUID.randomUUID())
                .user(workerUser1)
                .primaryCooperative(societyA)
                .isAvailable(true)
                .rotationWeight(new BigDecimal("2.00"))
                .currentRating(new BigDecimal("4.9"))
                .build();

        // Worker 2 -> Society A -> Logged In / Available
        workerUser2 = User.builder()
                .id(UUID.randomUUID())
                .name("Worker 2")
                .username("worker2")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();

        worker2 = Worker.builder()
                .id(UUID.randomUUID())
                .user(workerUser2)
                .primaryCooperative(societyA)
                .isAvailable(true)
                .rotationWeight(new BigDecimal("1.50"))
                .currentRating(new BigDecimal("4.7"))
                .build();

        // Worker 3 -> Society B -> Logged In / Available
        workerUser3 = User.builder()
                .id(UUID.randomUUID())
                .name("Worker 3")
                .username("worker3")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();

        worker3 = Worker.builder()
                .id(UUID.randomUUID())
                .user(workerUser3)
                .primaryCooperative(societyB)
                .isAvailable(true)
                .rotationWeight(new BigDecimal("3.00"))
                .currentRating(new BigDecimal("5.0"))
                .build();

        plumbingCategory = ServiceCategory.builder()
                .id(UUID.randomUUID())
                .name("Plumber")
                .slug("plumber")
                .basePrice(new BigDecimal("300.00"))
                .build();
    }

    @Test
    @DisplayName("Create Booking strictly selects workers from Customer's Cooperative Society A (Hard Boundary)")
    void testCreateBooking_StrictSocietyBoundary() {
        CreateBookingRequestDto request = CreateBookingRequestDto.builder()
                .serviceCategoryId(plumbingCategory.getId())
                .serviceAddress("456 Water Pipe Rd")
                .specialInstructions("My water pipe is damaged.")
                .latitude(13.0827)
                .longitude(80.2707)
                .build();

        when(customerRepository.findByUserId(customerUser.getId())).thenReturn(Optional.of(customer));
        when(serviceCategoryRepository.findById(plumbingCategory.getId())).thenReturn(Optional.of(plumbingCategory));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> {
            Booking b = i.getArgument(0);
            if (b.getId() == null) {
                b.setId(UUID.randomUUID());
            }
            return b;
        });

        // Query for available workers in Society A returns worker1 and worker2 (Worker 3 in Society B is NOT returned)
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(List.of(worker1, worker2));
        when(assignmentRepository.findByBookingId(any())).thenReturn(Collections.emptyList());
        when(bookingRepository.findById(any())).thenAnswer(i -> {
            UUID id = i.getArgument(0);
            Booking b = Booking.builder()
                    .id(id)
                    .bookingReference("BG-12345678")
                    .customer(customer)
                    .serviceCategory(plumbingCategory)
                    .assignedWorker(worker1)
                    .status(BookingStatus.ASSIGNED)
                    .serviceAddress(request.getServiceAddress())
                    .specialInstructions(request.getSpecialInstructions())
                    .build();
            return Optional.of(b);
        });

        BookingResponseDto dto = bookingService.createBooking(customerUser.getId(), request);

        assertNotNull(dto);
        assertEquals(customer.getId(), dto.getCustomerId());
        assertEquals(societyA.getId(), dto.getCustomerCooperativeId());
        assertEquals("Society A", dto.getCustomerCooperativeName());
        assertEquals(worker1.getId(), dto.getAssignedWorkerId());

        // Verify query was strictly executed with Society A's ID
        verify(workerRepository).findEligibleWorkersByCooperativeSorted(societyA.getId());
        verify(workerRepository, never()).findEligibleWorkersByCooperativeSorted(societyB.getId());
    }

    @Test
    @DisplayName("State machine handles rejection and dispatches to next eligible worker in SAME society")
    void testWorkerRejection_DispatchesNextWorkerInSameSociety() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-999")
                .customer(customer)
                .serviceCategory(plumbingCategory)
                .assignedWorker(worker1)
                .status(BookingStatus.ASSIGNED)
                .build();

        Assignment assignment1 = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(worker1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now())
                .rank(1)
                .rotationWeightUsed(worker1.getRotationWeight())
                .build();

        when(workerRepository.findByUserId(workerUser1.getId())).thenReturn(Optional.of(worker1));
        when(assignmentRepository.findById(assignment1.getId())).thenReturn(Optional.of(assignment1));
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findByBookingId(bookingId)).thenReturn(List.of(assignment1));

        // When Worker 1 rejects, dispatchNextWorker queries Society A workers. Worker 1 is already in attempted list, so Worker 2 is selected.
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(List.of(worker1, worker2));

        RespondAssignmentDto rejectDto = RespondAssignmentDto.builder().accept(false).build();

        BookingResponseDto result = bookingService.respondToAssignment(workerUser1.getId(), assignment1.getId(), rejectDto);

        assertNotNull(result);
        assertEquals(AssignmentStatus.REJECTED, assignment1.getStatus());

        // Verify assignment saved as REJECTED and new assignment created for Worker 2
        ArgumentCaptor<Assignment> assignmentCaptor = ArgumentCaptor.forClass(Assignment.class);
        verify(assignmentRepository, atLeastOnce()).save(assignmentCaptor.capture());

        List<Assignment> savedAssignments = assignmentCaptor.getAllValues();
        assertTrue(savedAssignments.stream().anyMatch(a -> a.getWorker().getId().equals(worker2.getId()) && a.getStatus() == AssignmentStatus.OFFERED));

        // Verify Worker 3 (Society B) was NEVER queried or offered
        verify(workerRepository, never()).findEligibleWorkersByCooperativeSorted(societyB.getId());
    }

    @Test
    @DisplayName("30-Second offer timeout expires offer and dispatches to next worker in SAME society")
    void test30SecondTimeout_AutoExpiresOfferAndDispatchesNextWorker() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-888")
                .customer(customer)
                .serviceCategory(plumbingCategory)
                .assignedWorker(worker1)
                .status(BookingStatus.ASSIGNED)
                .build();

        Assignment expiredAssignment = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(worker1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now().minusSeconds(31)) // Older than 30s
                .rank(1)
                .rotationWeightUsed(worker1.getRotationWeight())
                .build();

        when(assignmentRepository.findExpiredAssignments(eq(AssignmentStatus.OFFERED), any(Instant.class)))
                .thenReturn(List.of(expiredAssignment));
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(assignmentRepository.findByBookingId(bookingId)).thenReturn(List.of(expiredAssignment));
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId()))
                .thenReturn(List.of(worker1, worker2));

        bookingService.expirePendingOffersAndDispatchNext();

        assertTrue(expiredAssignment.getStatus() == AssignmentStatus.TIMED_OUT || expiredAssignment.getStatus() == AssignmentStatus.AUTO_EXPIRED);

        ArgumentCaptor<Assignment> assignmentCaptor = ArgumentCaptor.forClass(Assignment.class);
        verify(assignmentRepository, atLeastOnce()).save(assignmentCaptor.capture());

        List<Assignment> savedAssignments = assignmentCaptor.getAllValues();
        assertTrue(savedAssignments.stream().anyMatch(a -> a.getWorker().getId().equals(worker2.getId()) && a.getStatus() == AssignmentStatus.OFFERED));
    }

    @Test
    @DisplayName("Worker acceptance transitions booking to ACCEPTED state")
    void testWorkerAcceptance_TransitionsBookingToAccepted() {
        UUID bookingId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .bookingReference("BG-777")
                .customer(customer)
                .serviceCategory(plumbingCategory)
                .assignedWorker(worker1)
                .status(BookingStatus.ASSIGNED)
                .build();

        Assignment assignment1 = Assignment.builder()
                .id(UUID.randomUUID())
                .booking(booking)
                .worker(worker1)
                .status(AssignmentStatus.OFFERED)
                .assignedAt(Instant.now())
                .rank(1)
                .rotationWeightUsed(worker1.getRotationWeight())
                .build();

        when(workerRepository.findByUserId(workerUser1.getId())).thenReturn(Optional.of(worker1));
        when(assignmentRepository.findById(assignment1.getId())).thenReturn(Optional.of(assignment1));
        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));

        RespondAssignmentDto acceptDto = RespondAssignmentDto.builder().accept(true).build();

        BookingResponseDto result = bookingService.respondToAssignment(workerUser1.getId(), assignment1.getId(), acceptDto);

        assertEquals(AssignmentStatus.ACCEPTED, assignment1.getStatus());
        assertEquals(BookingStatus.ACCEPTED, booking.getStatus());
        assertEquals(worker1, booking.getAssignedWorker());
    }

    @Test
    @DisplayName("Customer without cooperative society throws IllegalStateException on booking creation")
    void testCreateBooking_WithoutCooperative_ThrowsException() {
        Customer unaffiliatedCustomer = Customer.builder()
                .id(UUID.randomUUID())
                .user(customerUser)
                .cooperative(null)
                .build();

        when(customerRepository.findByUserId(customerUser.getId())).thenReturn(Optional.of(unaffiliatedCustomer));

        CreateBookingRequestDto request = CreateBookingRequestDto.builder()
                .serviceAddress("123 Street")
                .build();

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                bookingService.createBooking(customerUser.getId(), request));

        assertTrue(ex.getMessage().contains("Customer is not affiliated with a cooperative society"));
    }
}

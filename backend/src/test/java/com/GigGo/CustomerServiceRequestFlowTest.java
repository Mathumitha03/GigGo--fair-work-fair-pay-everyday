package com.GigGo;

import com.GigGo.dto.booking.CreateServiceRequestDto;
import com.GigGo.dto.booking.ServiceRequestResponseDto;
import com.GigGo.dto.service.ServiceCategoryResponseDto;
import com.GigGo.dto.service.ServiceProblemResponseDto;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.booking.Booking;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.Customer;
import com.GigGo.entity.service.ServiceCategory;
import com.GigGo.entity.service.ServiceProblem;
import com.GigGo.enums.BookingStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.repository.AssignmentRepository;
import com.GigGo.repository.BookingRepository;
import com.GigGo.repository.BookingStatusHistoryRepository;
import com.GigGo.repository.CustomerRepository;
import com.GigGo.repository.LabourCooperativeRepository;
import com.GigGo.repository.ServiceCategoryRepository;
import com.GigGo.repository.ServiceProblemRepository;
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.service.impl.BookingServiceImpl;
import com.GigGo.service.impl.ServiceCatalogServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class CustomerServiceRequestFlowTest {

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
    private com.GigGo.repository.ServiceOfferingRepository serviceOfferingRepository;

    @Mock
    private com.GigGo.service.WorkerNotificationService workerNotificationService;

    @InjectMocks
    private ServiceCatalogServiceImpl serviceCatalogService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private LabourCooperative societyA;

    private User customerUserA;
    private Customer customerA;

    private User customerUserB;
    private Customer customerB;

    private User workerUser;
    private User managerUser;

    private ServiceCategory carpenterCategory;
    private ServiceCategory painterCategory;

    private ServiceProblem doorRepairProblem;
    private ServiceProblem furnitureRepairProblem;
    private ServiceProblem interiorPaintingProblem;

    @BeforeEach
    void setUp() {
        societyA = LabourCooperative.builder()
                .id(UUID.randomUUID())
                .name("Apex Labour Cooperative Society A")
                .registrationNumber("REG-SOC-A")
                .region("Chennai")
                .isActive(true)
                .build();

        customerUserA = User.builder()
                .id(UUID.randomUUID())
                .name("Customer A")
                .username("customerA")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        customerA = Customer.builder()
                .id(UUID.randomUUID())
                .user(customerUserA)
                .cooperative(societyA)
                .build();

        customerUserB = User.builder()
                .id(UUID.randomUUID())
                .name("Customer B")
                .username("customerB")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        customerB = Customer.builder()
                .id(UUID.randomUUID())
                .user(customerUserB)
                .cooperative(societyA)
                .build();

        workerUser = User.builder()
                .id(UUID.randomUUID())
                .name("Worker One")
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();

        managerUser = User.builder()
                .id(UUID.randomUUID())
                .name("Manager One")
                .role(UserRole.COOPERATIVE_MANAGER)
                .status(UserStatus.ACTIVE)
                .build();

        carpenterCategory = ServiceCategory.builder()
                .id(UUID.randomUUID())
                .name("CARPENTER")
                .slug("carpenter")
                .basePrice(new BigDecimal("400.00"))
                .isActive(true)
                .build();

        painterCategory = ServiceCategory.builder()
                .id(UUID.randomUUID())
                .name("PAINTER")
                .slug("painter")
                .basePrice(new BigDecimal("450.00"))
                .isActive(true)
                .build();

        doorRepairProblem = ServiceProblem.builder()
                .id(UUID.randomUUID())
                .category(carpenterCategory)
                .name("Door repair")
                .estimatedPrice(new BigDecimal("350.00"))
                .isActive(true)
                .build();

        furnitureRepairProblem = ServiceProblem.builder()
                .id(UUID.randomUUID())
                .category(carpenterCategory)
                .name("Furniture repair")
                .estimatedPrice(new BigDecimal("450.00"))
                .isActive(true)
                .build();

        interiorPaintingProblem = ServiceProblem.builder()
                .id(UUID.randomUUID())
                .category(painterCategory)
                .name("Interior painting")
                .estimatedPrice(new BigDecimal("800.00"))
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("TEST 1: Authenticated CUSTOMER requests services (200 OK)")
    void test1_AuthenticatedCustomerRequestsServices() {
        when(serviceCategoryRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc())
                .thenReturn(List.of(carpenterCategory, painterCategory));

        List<ServiceCategoryResponseDto> result = serviceCatalogService.getAllServiceCategories();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("CARPENTER", result.get(0).getName());
        assertEquals("PAINTER", result.get(1).getName());
    }

    @Test
    @DisplayName("TEST 2: Authenticated CUSTOMER requests problems for CARPENTER (Only CARPENTER problems returned)")
    void test2_GetProblemsForCarpenter_ReturnsOnlyCarpenterProblems() {
        when(serviceCategoryRepository.existsById(carpenterCategory.getId())).thenReturn(true);
        when(serviceProblemRepository.findByCategoryIdAndIsActiveTrue(carpenterCategory.getId()))
                .thenReturn(List.of(doorRepairProblem, furnitureRepairProblem));

        List<ServiceProblemResponseDto> result = serviceCatalogService.getProblemsForService(carpenterCategory.getId());

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(p -> p.getServiceId().equals(carpenterCategory.getId())));
        assertEquals("Door repair", result.get(0).getName());
    }

    @Test
    @DisplayName("TEST 3: Customer sends a problem belonging to another service -> 400 Bad Request")
    void test3_ProblemBelongsToAnotherService_ThrowsBadRequestException() {
        CreateServiceRequestDto request = CreateServiceRequestDto.builder()
                .serviceId(carpenterCategory.getId()) // CARPENTER
                .problemId(interiorPaintingProblem.getId()) // Belongs to PAINTER!
                .latitude(11.0168)
                .longitude(76.9558)
                .build();

        when(customerRepository.findByUserId(customerUserA.getId())).thenReturn(Optional.of(customerA));
        when(serviceCategoryRepository.findById(carpenterCategory.getId())).thenReturn(Optional.of(carpenterCategory));
        when(serviceProblemRepository.findById(interiorPaintingProblem.getId())).thenReturn(Optional.of(interiorPaintingProblem));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                bookingService.createServiceRequest(customerUserA.getId(), request));

        assertTrue(ex.getMessage().contains("does not belong to service category"));
    }

    @Test
    @DisplayName("TEST 4 & 5: Create Service Request (CARPENTER, Door repair, Lat/Lng) -> 201 Created & verified fields")
    void test4And5_CreateServiceRequest_StoresCustomerSocietyServiceProblemLocationStatus() {
        CreateServiceRequestDto request = CreateServiceRequestDto.builder()
                .serviceId(carpenterCategory.getId())
                .problemId(doorRepairProblem.getId())
                .latitude(11.0168)
                .longitude(76.9558)
                .serviceAddress("123 Main St, Coimbatore")
                .build();

        when(customerRepository.findByUserId(customerUserA.getId())).thenReturn(Optional.of(customerA));
        when(serviceCategoryRepository.findById(carpenterCategory.getId())).thenReturn(Optional.of(carpenterCategory));
        when(serviceProblemRepository.findById(doorRepairProblem.getId())).thenReturn(Optional.of(doorRepairProblem));
        when(workerRepository.findEligibleWorkersByCooperativeSorted(societyA.getId())).thenReturn(Collections.emptyList());

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            if (b.getId() == null) {
                b.setId(UUID.randomUUID());
            }
            return b;
        });

        ServiceRequestResponseDto result = bookingService.createServiceRequest(customerUserA.getId(), request);

        assertNotNull(result);
        assertNotNull(result.getRequestId());
        assertEquals("CARPENTER", result.getService());
        assertEquals("Door repair", result.getProblem());
        assertEquals(customerA.getId(), result.getCustomerId());
        assertEquals(societyA.getId(), result.getSocietyId());
        assertEquals("Apex Labour Cooperative Society A", result.getSocietyName());
        assertEquals(11.0168, result.getLatitude());
        assertEquals(76.9558, result.getLongitude());
        assertEquals("SEARCHING_WORKER", result.getStatus());

        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    @DisplayName("TEST 6: Customer A attempts to access Customer B's request -> 403 Forbidden")
    void test6_CustomerA_Accesses_CustomerB_Request_ThrowsAccessDeniedException() {
        UUID requestId = UUID.randomUUID();
        GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326);
        Point point = gf.createPoint(new Coordinate(76.9558, 11.0168));

        Booking customerBBooking = Booking.builder()
                .id(requestId)
                .bookingReference("BG-BBB")
                .customer(customerB) // Belongs to Customer B
                .serviceCategory(carpenterCategory)
                .serviceProblem(doorRepairProblem)
                .location(point)
                .serviceAddress("Customer B House")
                .status(BookingStatus.REQUESTED)
                .build();

        when(bookingRepository.findById(requestId)).thenReturn(Optional.of(customerBBooking));

        // Customer A attempts to access Customer B's request
        assertThrows(AccessDeniedException.class, () ->
                bookingService.getServiceRequestById(requestId, customerUserA.getId()));
    }

    @Test
    @DisplayName("TEST 7: Invalid latitude -> 400 Bad Request")
    void test7_InvalidLatitude_ThrowsBadRequestException() {
        CreateServiceRequestDto request = CreateServiceRequestDto.builder()
                .serviceId(carpenterCategory.getId())
                .problemId(doorRepairProblem.getId())
                .latitude(95.0) // Invalid! (Must be between -90 and 90)
                .longitude(76.9558)
                .build();

        when(customerRepository.findByUserId(customerUserA.getId())).thenReturn(Optional.of(customerA));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                bookingService.createServiceRequest(customerUserA.getId(), request));

        assertTrue(ex.getMessage().contains("Latitude must be between -90 and 90"));
    }

    @Test
    @DisplayName("TEST 8: Invalid longitude -> 400 Bad Request")
    void test8_InvalidLongitude_ThrowsBadRequestException() {
        CreateServiceRequestDto request = CreateServiceRequestDto.builder()
                .serviceId(carpenterCategory.getId())
                .problemId(doorRepairProblem.getId())
                .latitude(11.0168)
                .longitude(-190.0) // Invalid! (Must be between -180 and 180)
                .build();

        when(customerRepository.findByUserId(customerUserA.getId())).thenReturn(Optional.of(customerA));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                bookingService.createServiceRequest(customerUserA.getId(), request));

        assertTrue(ex.getMessage().contains("Longitude must be between -180 and 180"));
    }
}

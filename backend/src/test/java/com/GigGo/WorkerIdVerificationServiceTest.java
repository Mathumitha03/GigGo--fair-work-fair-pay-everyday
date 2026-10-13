package com.GigGo;

import com.GigGo.dto.worker.WorkerIdVerificationResponse;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.enums.WorkerVerificationStatus;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.impl.WorkerIdVerificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WorkerIdVerificationServiceTest {

    @Mock
    private WorkerRepository workerRepository;

    @InjectMocks
    private WorkerIdVerificationServiceImpl service;

    private UUID userXxxxId;
    private UserPrincipal workerXxxxPrincipal;
    private Worker workerXxxx;

    private UUID userYyyyId;
    private UserPrincipal workerYyyyPrincipal;
    private Worker workerYyyy;

    private UserPrincipal customerPrincipal;
    private UserPrincipal managerPrincipal;

    @BeforeEach
    void setUp() {
        userXxxxId = UUID.randomUUID();
        workerXxxxPrincipal = new UserPrincipal(
                userXxxxId, "Worker xxxx", "xxxx", "xxxx@example.com", "9894942310", "password",
                UserRole.WORKER, UserStatus.ACTIVE, Collections.singletonList(new SimpleGrantedAuthority("ROLE_WORKER"))
        );

        User userXxxx = User.builder().name("Worker xxxx").username("xxxx").role(UserRole.WORKER).build();
        userXxxx.setId(userXxxxId);

        workerXxxx = Worker.builder()
                .user(userXxxx)
                .cooperativeWorkerId("TN-78")
                .verificationStatus(WorkerVerificationStatus.UNVERIFIED)
                .build();

        userYyyyId = UUID.randomUUID();
        workerYyyyPrincipal = new UserPrincipal(
                userYyyyId, "Worker yyyy", "yyyy", "yyyy@example.com", "9894942311", "password",
                UserRole.WORKER, UserStatus.ACTIVE, Collections.singletonList(new SimpleGrantedAuthority("ROLE_WORKER"))
        );

        User userYyyy = User.builder().name("Worker yyyy").username("yyyy").role(UserRole.WORKER).build();
        userYyyy.setId(userYyyyId);

        workerYyyy = Worker.builder()
                .user(userYyyy)
                .cooperativeWorkerId("TN-45")
                .verificationStatus(WorkerVerificationStatus.UNVERIFIED)
                .build();

        customerPrincipal = new UserPrincipal(
                UUID.randomUUID(), "Customer User", "customer1", "cust@example.com", "9894940001", "password",
                UserRole.CUSTOMER, UserStatus.ACTIVE, Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );

        managerPrincipal = new UserPrincipal(
                UUID.randomUUID(), "Manager User", "manager1", "mgr@example.com", "9894940002", "password",
                UserRole.COOPERATIVE_MANAGER, UserStatus.ACTIVE, Collections.singletonList(new SimpleGrantedAuthority("ROLE_COOPERATIVE_MANAGER"))
        );
    }

    @Test
    @DisplayName("Test 1: Worker xxxx (registered ID TN-78) enters TN-78 -> verified = true and status updated to ID_VERIFIED")
    void test1_WorkerXxxx_EntersTN78_ReturnsTrue() {
        when(workerRepository.findByUserId(userXxxxId)).thenReturn(Optional.of(workerXxxx));

        WorkerIdVerificationResponse response = service.verifyWorkerIdForAuthenticatedWorker(workerXxxxPrincipal, "TN-78");

        assertTrue(response.isVerified());
        assertEquals("Worker ID verified successfully", response.getMessage());
        assertEquals("TN-78", response.getWorkerId());
        assertEquals(WorkerVerificationStatus.ID_VERIFIED, workerXxxx.getVerificationStatus());
        verify(workerRepository).save(workerXxxx);
    }

    @Test
    @DisplayName("Test 2: Worker xxxx (registered ID TN-78) enters TN-70 -> verified = false")
    void test2_WorkerXxxx_EntersTN70_ReturnsFalse() {
        when(workerRepository.findByUserId(userXxxxId)).thenReturn(Optional.of(workerXxxx));

        WorkerIdVerificationResponse response = service.verifyWorkerIdForAuthenticatedWorker(workerXxxxPrincipal, "TN-70");

        assertFalse(response.isVerified());
        assertEquals("Worker ID does not match your registered Cooperative Worker ID", response.getMessage());
        assertEquals("TN-70", response.getWorkerId());
        assertEquals(WorkerVerificationStatus.UNVERIFIED, workerXxxx.getVerificationStatus());
        verify(workerRepository, never()).save(any(Worker.class));
    }

    @Test
    @DisplayName("Test 3: Worker yyyy (registered ID TN-45) enters TN-78 -> verified = false")
    void test3_WorkerYyyy_EntersTN78_ReturnsFalse() {
        when(workerRepository.findByUserId(userYyyyId)).thenReturn(Optional.of(workerYyyy));

        WorkerIdVerificationResponse response = service.verifyWorkerIdForAuthenticatedWorker(workerYyyyPrincipal, "TN-78");

        assertFalse(response.isVerified());
        assertEquals("Worker ID does not match your registered Cooperative Worker ID", response.getMessage());
        assertEquals("TN-78", response.getWorkerId());
        assertEquals(WorkerVerificationStatus.UNVERIFIED, workerYyyy.getVerificationStatus());
        verify(workerRepository, never()).save(any(Worker.class));
    }

    @Test
    @DisplayName("Test 4: Worker xxxx attempts to send another worker's ID (e.g. TN-100) -> verified = false")
    void test4_WorkerXxxx_EntersAnotherWorkerID_ReturnsFalse() {
        when(workerRepository.findByUserId(userXxxxId)).thenReturn(Optional.of(workerXxxx));

        WorkerIdVerificationResponse response = service.verifyWorkerIdForAuthenticatedWorker(workerXxxxPrincipal, "TN-100");

        assertFalse(response.isVerified());
        assertEquals("Worker ID does not match your registered Cooperative Worker ID", response.getMessage());
        assertEquals("TN-100", response.getWorkerId());
    }

    @Test
    @DisplayName("Test 5: Customer role attempts endpoint -> rejected (verified = false)")
    void test5_CustomerAttemptsEndpoint_Rejected() {
        WorkerIdVerificationResponse response = service.verifyWorkerIdForAuthenticatedWorker(customerPrincipal, "TN-78");

        assertFalse(response.isVerified());
        assertEquals("Only authenticated Workers can verify Cooperative Worker ID", response.getMessage());
        verify(workerRepository, never()).findByUserId(any(UUID.class));
    }

    @Test
    @DisplayName("Test 6: Manager role attempts endpoint -> rejected (verified = false)")
    void test6_ManagerAttemptsEndpoint_Rejected() {
        WorkerIdVerificationResponse response = service.verifyWorkerIdForAuthenticatedWorker(managerPrincipal, "TN-78");

        assertFalse(response.isVerified());
        assertEquals("Only authenticated Workers can verify Cooperative Worker ID", response.getMessage());
        verify(workerRepository, never()).findByUserId(any(UUID.class));
    }

    @Test
    @DisplayName("Whitespace and lower-case normalization: '  tn-78  ' matches 'TN-78'")
    void testNormalization_WhitespaceAndCaseMatching() {
        when(workerRepository.findByUserId(userXxxxId)).thenReturn(Optional.of(workerXxxx));

        WorkerIdVerificationResponse response = service.verifyWorkerIdForAuthenticatedWorker(workerXxxxPrincipal, "  tn-78  ");

        assertTrue(response.isVerified());
        assertEquals("TN-78", response.getWorkerId());
        assertEquals(WorkerVerificationStatus.ID_VERIFIED, workerXxxx.getVerificationStatus());
    }
}

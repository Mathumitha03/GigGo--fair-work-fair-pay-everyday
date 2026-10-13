package com.GigGo;

import com.GigGo.controller.WorkerVerificationController;
import com.GigGo.dto.worker.WorkerIdVerificationRequest;
import com.GigGo.dto.worker.WorkerIdVerificationResponse;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.WorkerIdVerificationService;
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
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WorkerVerificationControllerTest {

    @Mock
    private WorkerIdVerificationService verificationService;

    @InjectMocks
    private WorkerVerificationController controller;

    private UserPrincipal workerPrincipal;
    private UUID workerUserId;

    @BeforeEach
    void setUp() {
        workerUserId = UUID.randomUUID();
        workerPrincipal = new UserPrincipal(
                workerUserId,
                "Worker xxxx",
                "xxxx",
                "xxxx@example.com",
                "9894942310",
                "password",
                UserRole.WORKER,
                UserStatus.ACTIVE,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_WORKER"))
        );
    }

    @Test
    @DisplayName("verifyWorkerId returns 200 OK and verified=true when entered ID matches worker's registered ID")
    void testVerifyWorkerIdEndpoint_Success() {
        WorkerIdVerificationRequest request = new WorkerIdVerificationRequest("TN-78");
        WorkerIdVerificationResponse mockResponse = WorkerIdVerificationResponse.builder()
                .verified(true)
                .message("Worker ID verified successfully")
                .workerId("TN-78")
                .build();

        when(verificationService.verifyWorkerIdForAuthenticatedWorker(workerPrincipal, "TN-78"))
                .thenReturn(mockResponse);

        ResponseEntity<WorkerIdVerificationResponse> responseEntity = controller.verifyWorkerId(workerPrincipal, request);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertTrue(responseEntity.getBody().isVerified());
        assertEquals("Worker ID verified successfully", responseEntity.getBody().getMessage());
        assertEquals("TN-78", responseEntity.getBody().getWorkerId());

        verify(verificationService).verifyWorkerIdForAuthenticatedWorker(workerPrincipal, "TN-78");
    }

    @Test
    @DisplayName("verifyWorkerId returns 200 OK and verified=false when entered ID does not match registered ID")
    void testVerifyWorkerIdEndpoint_Mismatch() {
        WorkerIdVerificationRequest request = new WorkerIdVerificationRequest("TN-70");
        WorkerIdVerificationResponse mockResponse = WorkerIdVerificationResponse.builder()
                .verified(false)
                .message("Worker ID does not match your registered Cooperative Worker ID")
                .workerId("TN-70")
                .build();

        when(verificationService.verifyWorkerIdForAuthenticatedWorker(workerPrincipal, "TN-70"))
                .thenReturn(mockResponse);

        ResponseEntity<WorkerIdVerificationResponse> responseEntity = controller.verifyWorkerId(workerPrincipal, request);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertFalse(responseEntity.getBody().isVerified());
        assertEquals("Worker ID does not match your registered Cooperative Worker ID", responseEntity.getBody().getMessage());
        assertEquals("TN-70", responseEntity.getBody().getWorkerId());

        verify(verificationService).verifyWorkerIdForAuthenticatedWorker(workerPrincipal, "TN-70");
    }
}

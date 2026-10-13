package com.GigGo.service.impl;

import com.GigGo.dto.worker.WorkerIdVerificationResponse;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.WorkerVerificationStatus;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.WorkerIdVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkerIdVerificationServiceImpl implements WorkerIdVerificationService {

    private final WorkerRepository workerRepository;

    @Override
    @Transactional
    public WorkerIdVerificationResponse verifyWorkerIdForAuthenticatedWorker(UserPrincipal userPrincipal, String rawWorkerId) {
        if (userPrincipal == null || userPrincipal.getId() == null) {
            return WorkerIdVerificationResponse.builder()
                    .verified(false)
                    .message("User is not authenticated")
                    .build();
        }

        if (userPrincipal.getRole() != UserRole.WORKER) {
            log.warn("Non-worker role '{}' attempted worker ID verification", userPrincipal.getRole());
            return WorkerIdVerificationResponse.builder()
                    .verified(false)
                    .message("Only authenticated Workers can verify Cooperative Worker ID")
                    .build();
        }

        return verifyWorkerIdForWorker(userPrincipal.getId(), rawWorkerId);
    }

    @Override
    @Transactional
    public WorkerIdVerificationResponse verifyWorkerIdForWorker(UUID userId, String rawWorkerId) {
        if (rawWorkerId == null || rawWorkerId.trim().isEmpty()) {
            return WorkerIdVerificationResponse.builder()
                    .verified(false)
                    .message("Worker ID is required")
                    .build();
        }

        String cleanedEnteredId = rawWorkerId.trim().toUpperCase();

        // 1. Load authenticated worker profile from PostgreSQL
        Worker worker = workerRepository.findByUserId(userId)
                .orElse(null);

        if (worker == null) {
            return WorkerIdVerificationResponse.builder()
                    .verified(false)
                    .message("Worker profile not found for authenticated user")
                    .workerId(cleanedEnteredId)
                    .build();
        }

        // 2. Retrieve registered cooperativeWorkerId for this authenticated worker
        String registeredCoopId = worker.getCooperativeWorkerId();
        if (registeredCoopId == null || registeredCoopId.trim().isEmpty()) {
            return WorkerIdVerificationResponse.builder()
                    .verified(false)
                    .message("No Cooperative Worker ID is registered for this worker profile")
                    .workerId(cleanedEnteredId)
                    .build();
        }

        String cleanedRegisteredId = registeredCoopId.trim().toUpperCase();

        // 3. Exact comparison between authenticated worker's registered ID vs entered ID
        if (!cleanedRegisteredId.equals(cleanedEnteredId)) {
            log.info("Worker ID verification failed for user {}: registered '{}', entered '{}'",
                    userId, cleanedRegisteredId, cleanedEnteredId);
            return WorkerIdVerificationResponse.builder()
                    .verified(false)
                    .message("Worker ID does not match your registered Cooperative Worker ID")
                    .workerId(cleanedEnteredId)
                    .build();
        }

        // 4. Update worker verification status to ID_VERIFIED
        worker.setVerificationStatus(WorkerVerificationStatus.ID_VERIFIED);
        workerRepository.save(worker);
        log.info("Worker ID {} verified successfully for worker user {}", cleanedEnteredId, userId);

        return WorkerIdVerificationResponse.builder()
                .verified(true)
                .message("Worker ID verified successfully")
                .workerId(cleanedEnteredId)
                .build();
    }
}

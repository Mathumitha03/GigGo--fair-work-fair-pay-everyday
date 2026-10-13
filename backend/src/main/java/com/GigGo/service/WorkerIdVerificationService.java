package com.GigGo.service;

import com.GigGo.dto.worker.WorkerIdVerificationResponse;
import com.GigGo.security.UserPrincipal;

import java.util.UUID;

public interface WorkerIdVerificationService {

    WorkerIdVerificationResponse verifyWorkerIdForAuthenticatedWorker(UserPrincipal userPrincipal, String rawWorkerId);

    WorkerIdVerificationResponse verifyWorkerIdForWorker(UUID userId, String rawWorkerId);
}

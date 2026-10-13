package com.GigGo.controller;

import com.GigGo.dto.worker.WorkerIdVerificationRequest;
import com.GigGo.dto.worker.WorkerIdVerificationResponse;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.WorkerIdVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workers")
@RequiredArgsConstructor
@Tag(name = "Worker Verification", description = "Endpoints for verifying Cooperative Worker IDs after worker authentication")
public class WorkerVerificationController {

    private final WorkerIdVerificationService verificationService;

    @PostMapping("/verify-id")
    @PreAuthorize("hasRole('WORKER')")
    @Operation(summary = "Verify Cooperative Worker ID", description = "Verifies that the entered Cooperative Worker ID matches the authenticated worker's registered ID")
    public ResponseEntity<WorkerIdVerificationResponse> verifyWorkerId(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody WorkerIdVerificationRequest request) {

        WorkerIdVerificationResponse response = verificationService.verifyWorkerIdForAuthenticatedWorker(
                userPrincipal, request.getWorkerId());
        return ResponseEntity.ok(response);
    }
}

package com.GigGo.controller;

import com.GigGo.dto.auth.AdminRegisterRequest;
import com.GigGo.dto.auth.AuthResponse;
import com.GigGo.dto.auth.CustomerRegisterRequest;
import com.GigGo.dto.auth.LoginRequest;
import com.GigGo.dto.auth.RefreshTokenRequest;
import com.GigGo.dto.auth.UserProfileDto;
import com.GigGo.dto.auth.WorkerRegisterRequest;
import com.GigGo.dto.common.ApiResponse;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Onboarding", description = "Endpoints for Customer, Worker, Admin registration, Unified Login, and Profile")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/customer")
    @Operation(summary = "Register a new Customer", description = "Creates a Customer profile with phone/email/username and issues JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> registerCustomer(@Valid @RequestBody CustomerRegisterRequest request) {
        AuthResponse response = authService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Customer registered successfully"));
    }

    @PostMapping("/register/worker")
    @Operation(summary = "Register a new Worker", description = "Creates an unaffiliated Worker profile and issues JWT token. Worker can then request to create or join a cooperative.")
    public ResponseEntity<ApiResponse<AuthResponse>> registerWorker(@Valid @RequestBody WorkerRegisterRequest request) {
        AuthResponse response = authService.registerWorker(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Worker registered successfully. You can now request to create or join a cooperative society."));
    }

    @PostMapping("/register/admin")
    @Operation(summary = "Register an Admin", description = "Creates a Federation Admin account and issues JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> registerAdmin(@Valid @RequestBody AdminRegisterRequest request) {
        AuthResponse response = authService.registerAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Admin registered successfully"));
    }

    @PostMapping("/login")
    @Operation(summary = "Unified Login", description = "Accepts identifier (email, username, or phone number) + password for all 4 roles")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh Access Token", description = "Exchanges a valid refresh token for a new access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get Current User Profile", description = "Returns full profile including role-specific and worker affiliation details")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserProfileDto profile = authService.getCurrentUserProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile, "User profile retrieved successfully"));
    }
}

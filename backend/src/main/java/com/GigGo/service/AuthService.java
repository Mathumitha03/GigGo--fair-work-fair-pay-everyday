package com.GigGo.service;

import com.GigGo.dto.auth.AdminRegisterRequest;
import com.GigGo.dto.auth.AuthResponse;
import com.GigGo.dto.auth.CustomerRegisterRequest;
import com.GigGo.dto.auth.LoginRequest;
import com.GigGo.dto.auth.RefreshTokenRequest;
import com.GigGo.dto.auth.UserProfileDto;
import com.GigGo.dto.auth.WorkerRegisterRequest;

import com.GigGo.dto.auth.ForgotPasswordRequest;
import com.GigGo.dto.auth.GoogleAuthRequest;
import com.GigGo.dto.auth.ResetPasswordRequest;

import java.util.UUID;

public interface AuthService {

    AuthResponse registerCustomer(CustomerRegisterRequest request);

    AuthResponse registerWorker(WorkerRegisterRequest request);

    AuthResponse registerAdmin(AdminRegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    UserProfileDto getCurrentUserProfile(UUID userId);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    AuthResponse googleLogin(GoogleAuthRequest request);
}

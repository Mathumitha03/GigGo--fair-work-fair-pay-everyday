package com.GigGo;

import com.GigGo.controller.AuthController;
import com.GigGo.dto.auth.AuthResponse;
import com.GigGo.dto.auth.ForgotPasswordRequest;
import com.GigGo.dto.auth.GoogleAuthRequest;
import com.GigGo.dto.auth.LoginRequest;
import com.GigGo.dto.auth.ResetPasswordRequest;
import com.GigGo.dto.auth.UserProfileDto;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.exception.GlobalExceptionHandler;
import com.GigGo.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/v1/auth/forgot-password succeeds with valid email")
    void testForgotPassword_Success() throws Exception {
        ForgotPasswordRequest request = ForgotPasswordRequest.builder()
                .email("worker@giggo.coop")
                .build();

        doNothing().when(authService).forgotPassword(any(ForgotPasswordRequest.class));

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("If an account with that email exists, a password reset link has been sent to your email address."));
    }

    @Test
    @DisplayName("POST /api/v1/auth/forgot-password fails when email is invalid")
    void testForgotPassword_InvalidEmail() throws Exception {
        ForgotPasswordRequest request = ForgotPasswordRequest.builder()
                .email("not-an-email")
                .build();

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/v1/auth/reset-password succeeds with valid token and password")
    void testResetPassword_Success() throws Exception {
        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .token("valid-reset-token-xyz")
                .newPassword("NewPassword@2026")
                .build();

        doNothing().when(authService).resetPassword(any(ResetPasswordRequest.class));

        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password has been reset successfully. You can now login with your new password."));
    }

    @Test
    @DisplayName("POST /api/v1/auth/reset-password returns BAD_REQUEST when token is expired or invalid")
    void testResetPassword_ExpiredOrInvalidToken() throws Exception {
        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .token("expired-token")
                .newPassword("NewPassword@2026")
                .build();

        doThrow(new IllegalArgumentException("Password reset token has expired. Please request a new one"))
                .when(authService).resetPassword(any(ResetPasswordRequest.class));

        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Password reset token has expired. Please request a new one"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/google succeeds with valid ID token")
    void testGoogleLogin_Success() throws Exception {
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .idToken("valid-google-id-token")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("sample.access.jwt")
                .refreshToken("sample.refresh.jwt")
                .tokenType("Bearer")
                .expiresIn(86400L)
                .user(UserProfileDto.builder()
                        .id(UUID.randomUUID())
                        .name("Google Member")
                        .email("google.member@gmail.com")
                        .role(UserRole.CUSTOMER)
                        .status(UserStatus.ACTIVE)
                        .build())
                .build();

        when(authService.googleLogin(any(GoogleAuthRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("sample.access.jwt"))
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.user.email").value("google.member@gmail.com"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login succeeds with local credentials")
    void testLocalLogin_Success() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .identifier("admin@giggo.coop")
                .password("Admin@GigGo2026")
                .build();

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken("admin.access.jwt")
                .refreshToken("admin.refresh.jwt")
                .tokenType("Bearer")
                .expiresIn(86400L)
                .user(UserProfileDto.builder()
                        .id(UUID.randomUUID())
                        .name("Super Admin")
                        .email("admin@giggo.coop")
                        .role(UserRole.ADMIN)
                        .status(UserStatus.ACTIVE)
                        .build())
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("admin.access.jwt"))
                .andExpect(jsonPath("$.data.user.role").value("ADMIN"));
    }
}

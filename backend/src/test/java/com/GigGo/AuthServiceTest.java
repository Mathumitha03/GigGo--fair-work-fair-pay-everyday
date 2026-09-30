package com.GigGo;

import com.GigGo.dto.auth.AdminRegisterRequest;
import com.GigGo.dto.auth.AuthResponse;
import com.GigGo.dto.auth.CustomerRegisterRequest;
import com.GigGo.dto.auth.LoginRequest;
import com.GigGo.dto.auth.WorkerRegisterRequest;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.profile.Admin;
import com.GigGo.entity.profile.Customer;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.AffiliationStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.enums.WorkerVerificationStatus;
import com.GigGo.repository.AdminRepository;
import com.GigGo.repository.CooperativeManagerRepository;
import com.GigGo.repository.CustomerRepository;
import com.GigGo.repository.PasswordResetTokenRepository;
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.security.JwtTokenProvider;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.EmailService;
import com.GigGo.service.GoogleAuthService;
import com.GigGo.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkerRepository workerRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private CooperativeManagerRepository cooperativeManagerRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private GoogleAuthService googleAuthService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleAdminUser;

    @BeforeEach
    void setUp() {
        sampleAdminUser = User.builder()
                .name("Cooperative Federation Super Admin")
                .username("admin")
                .email("admin@giggo.coop")
                .phone("9894942303")
                .passwordHash("$2a$12$hashedPassword")
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("Worker Registration creates UNAFFILIATED worker profile")
    void testRegisterWorker_InitialStateUnaffiliated() {
        WorkerRegisterRequest request = WorkerRegisterRequest.builder()
                .name("Arun Kumar")
                .username("arun_electrician")
                .phone("9894942310")
                .email("arun@example.com")
                .password("Worker@123")
                .skills("Electrician, Wiring")
                .experienceYears(5)
                .build();

        when(userRepository.existsByPhone(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$encoded");

        UUID generatedUserId = UUID.randomUUID();
        User savedUser = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .phone(request.getPhone())
                .email(request.getEmail())
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .build();
        savedUser.setId(generatedUserId);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UUID generatedWorkerId = UUID.randomUUID();
        Worker savedWorker = Worker.builder()
                .user(savedUser)
                .skills(request.getSkills())
                .experienceYears(5)
                .affiliationStatus(AffiliationStatus.UNAFFILIATED)
                .verificationStatus(WorkerVerificationStatus.UNVERIFIED)
                .build();
        savedWorker.setId(generatedWorkerId);

        when(workerRepository.save(any(Worker.class))).thenReturn(savedWorker);
        when(workerRepository.findByUserId(generatedUserId)).thenReturn(Optional.of(savedWorker));
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("dummy.jwt.token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("dummy.refresh.token");

        AuthResponse response = authService.registerWorker(request);

        assertNotNull(response);
        assertEquals("dummy.jwt.token", response.getAccessToken());
        assertEquals(UserRole.WORKER, response.getUser().getRole());
        assertEquals(AffiliationStatus.UNAFFILIATED, response.getUser().getAffiliationStatus());
        assertFalse(response.getUser().getIsAffiliated(), "Newly registered worker must be unaffiliated");

        verify(userRepository).save(any(User.class));
        verify(workerRepository).save(any(Worker.class));
    }

    @Test
    @DisplayName("Unified Login succeeds with Phone Number (9894942303)")
    void testLogin_WithPhoneNumber() {
        LoginRequest request = LoginRequest.builder()
                .identifier("9894942303")
                .password("Admin@GigGo2026")
                .build();

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuth);
        when(userRepository.findByIdentifier("9894942303")).thenReturn(Optional.of(sampleAdminUser));
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("admin.jwt.token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("admin.refresh.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("admin.jwt.token", response.getAccessToken());
        assertEquals("9894942303", response.getUser().getPhone());
        assertEquals(UserRole.ADMIN, response.getUser().getRole());
    }

    @Test
    @DisplayName("Unified Login succeeds with Email Address (admin@giggo.coop)")
    void testLogin_WithEmail() {
        LoginRequest request = LoginRequest.builder()
                .identifier("admin@giggo.coop")
                .password("Admin@GigGo2026")
                .build();

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuth);
        when(userRepository.findByIdentifier("admin@giggo.coop")).thenReturn(Optional.of(sampleAdminUser));
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("admin.jwt.token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("admin.refresh.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("admin.jwt.token", response.getAccessToken());
        assertEquals("admin@giggo.coop", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Unified Login succeeds with Username (admin)")
    void testLogin_WithUsername() {
        LoginRequest request = LoginRequest.builder()
                .identifier("admin")
                .password("Admin@GigGo2026")
                .build();

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuth);
        when(userRepository.findByIdentifier("admin")).thenReturn(Optional.of(sampleAdminUser));
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("admin.jwt.token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("admin.refresh.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("admin.jwt.token", response.getAccessToken());
        assertEquals("admin", response.getUser().getUsername());
    }

    @Test
    @DisplayName("Login with wrong password throws BadCredentialsException")
    void testLogin_BadCredentials() {
        LoginRequest request = LoginRequest.builder()
                .identifier("9894942303")
                .password("WrongPassword")
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Forgot password with registered email creates token and sends email")
    void testForgotPassword_RegisteredEmail() {
        com.GigGo.dto.auth.ForgotPasswordRequest request = com.GigGo.dto.auth.ForgotPasswordRequest.builder()
                .email("admin@giggo.coop")
                .build();

        when(userRepository.findByEmail("admin@giggo.coop")).thenReturn(Optional.of(sampleAdminUser));

        authService.forgotPassword(request);

        verify(passwordResetTokenRepository).invalidateAllActiveTokensForUser(any(User.class), any(java.time.Instant.class));
        verify(passwordResetTokenRepository).save(any(com.GigGo.entity.authentication.PasswordResetToken.class));
        verify(emailService).sendPasswordResetEmail(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Forgot password with unregistered email avoids enumeration and does not send email")
    void testForgotPassword_UnregisteredEmail() {
        com.GigGo.dto.auth.ForgotPasswordRequest request = com.GigGo.dto.auth.ForgotPasswordRequest.builder()
                .email("nonexistent@giggo.coop")
                .build();

        when(userRepository.findByEmail("nonexistent@giggo.coop")).thenReturn(Optional.empty());

        authService.forgotPassword(request);

        verify(passwordResetTokenRepository, org.mockito.Mockito.never()).save(any());
        verify(emailService, org.mockito.Mockito.never()).sendPasswordResetEmail(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("Reset password with valid token hashes new password and marks token used")
    void testResetPassword_ValidToken() {
        com.GigGo.dto.auth.ResetPasswordRequest request = com.GigGo.dto.auth.ResetPasswordRequest.builder()
                .token("valid-reset-token-123")
                .newPassword("NewSecurePassword@2026")
                .build();

        com.GigGo.entity.authentication.PasswordResetToken token = com.GigGo.entity.authentication.PasswordResetToken.builder()
                .user(sampleAdminUser)
                .token("valid-reset-token-123")
                .expiresAt(java.time.Instant.now().plusSeconds(600))
                .isUsed(false)
                .build();

        when(passwordResetTokenRepository.findByToken("valid-reset-token-123")).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("NewSecurePassword@2026")).thenReturn("$2a$12$newHashedPassword");

        authService.resetPassword(request);

        assertEquals(true, token.isUsed());
        assertNotNull(token.getUsedAt());
        assertEquals("$2a$12$newHashedPassword", sampleAdminUser.getPasswordHash());

        verify(userRepository).save(sampleAdminUser);
        verify(passwordResetTokenRepository).save(token);
    }

    @Test
    @DisplayName("Reset password with expired token throws IllegalArgumentException")
    void testResetPassword_ExpiredToken() {
        com.GigGo.dto.auth.ResetPasswordRequest request = com.GigGo.dto.auth.ResetPasswordRequest.builder()
                .token("expired-token-123")
                .newPassword("NewSecurePassword@2026")
                .build();

        com.GigGo.entity.authentication.PasswordResetToken token = com.GigGo.entity.authentication.PasswordResetToken.builder()
                .user(sampleAdminUser)
                .token("expired-token-123")
                .expiresAt(java.time.Instant.now().minusSeconds(600))
                .isUsed(false)
                .build();

        when(passwordResetTokenRepository.findByToken("expired-token-123")).thenReturn(Optional.of(token));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.resetPassword(request));
        assertEquals("Password reset token has expired. Please request a new one", ex.getMessage());
    }

    @Test
    @DisplayName("Reset password with already used token throws IllegalArgumentException")
    void testResetPassword_AlreadyUsedToken() {
        com.GigGo.dto.auth.ResetPasswordRequest request = com.GigGo.dto.auth.ResetPasswordRequest.builder()
                .token("used-token-123")
                .newPassword("NewSecurePassword@2026")
                .build();

        com.GigGo.entity.authentication.PasswordResetToken token = com.GigGo.entity.authentication.PasswordResetToken.builder()
                .user(sampleAdminUser)
                .token("used-token-123")
                .expiresAt(java.time.Instant.now().plusSeconds(600))
                .isUsed(true)
                .usedAt(java.time.Instant.now().minusSeconds(100))
                .build();

        when(passwordResetTokenRepository.findByToken("used-token-123")).thenReturn(Optional.of(token));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.resetPassword(request));
        assertEquals("This password reset token has already been used", ex.getMessage());
    }

    @Test
    @DisplayName("Google Login delegates to GoogleAuthService")
    void testGoogleLogin_Delegation() {
        com.GigGo.dto.auth.GoogleAuthRequest request = com.GigGo.dto.auth.GoogleAuthRequest.builder()
                .idToken("google-id-token-abc")
                .build();

        AuthResponse mockAuthResponse = AuthResponse.builder()
                .accessToken("google.user.jwt")
                .tokenType("Bearer")
                .build();

        when(googleAuthService.authenticateGoogleUser(request)).thenReturn(mockAuthResponse);

        AuthResponse result = authService.googleLogin(request);

        assertNotNull(result);
        assertEquals("google.user.jwt", result.getAccessToken());
        verify(googleAuthService).authenticateGoogleUser(request);
    }
}

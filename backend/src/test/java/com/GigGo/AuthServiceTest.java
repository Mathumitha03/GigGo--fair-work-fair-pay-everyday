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
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.security.JwtTokenProvider;
import com.GigGo.security.UserPrincipal;
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
}

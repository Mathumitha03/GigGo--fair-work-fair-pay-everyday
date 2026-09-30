package com.GigGo;

import com.GigGo.dto.auth.AuthResponse;
import com.GigGo.dto.auth.GoogleAuthRequest;
import com.GigGo.dto.auth.GoogleUserInfo;
import com.GigGo.entity.authentication.OAuthAccount;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.profile.Customer;
import com.GigGo.entity.profile.Worker;
import com.GigGo.enums.OAuthProvider;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.repository.AdminRepository;
import com.GigGo.repository.CooperativeManagerRepository;
import com.GigGo.repository.CustomerRepository;
import com.GigGo.repository.OAuthAccountRepository;
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import com.GigGo.security.JwtTokenProvider;
import com.GigGo.security.UserPrincipal;
import com.GigGo.service.impl.GoogleAuthServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class GoogleAuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OAuthAccountRepository oauthAccountRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private WorkerRepository workerRepository;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private CooperativeManagerRepository cooperativeManagerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private GoogleAuthServiceImpl googleAuthService;

    private GoogleUserInfo sampleUserInfo;

    @BeforeEach
    void setUp() {
        sampleUserInfo = GoogleUserInfo.builder()
                .providerUserId("google-sub-10029384756")
                .email("alex.user@gmail.com")
                .name("Alex Johnson")
                .picture("https://lh3.googleusercontent.com/a/photo.jpg")
                .emailVerified(true)
                .build();
    }

    @Test
    @DisplayName("Case 1: New Google User registers and receives application JWT")
    void testProcessOAuth2User_NewUser() {
        when(oauthAccountRepository.findByProviderAndProviderUserId(OAuthProvider.GOOGLE, "google-sub-10029384756"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("alex.user@gmail.com"))
                .thenReturn(Optional.empty());
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$randomPasswordHash");

        UUID newUserId = UUID.randomUUID();
        User savedUser = User.builder()
                .name("Alex Johnson")
                .username("alex_johnson")
                .email("alex.user@gmail.com")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .isEmailVerified(true)
                .profileImageUrl("https://lh3.googleusercontent.com/a/photo.jpg")
                .build();
        savedUser.setId(newUserId);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(customerRepository.save(any(Customer.class))).thenReturn(Customer.builder().user(savedUser).build());
        when(oauthAccountRepository.save(any(OAuthAccount.class))).thenReturn(null);
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("google.jwt.access.token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("google.jwt.refresh.token");

        AuthResponse response = googleAuthService.processOAuth2User(sampleUserInfo, UserRole.CUSTOMER);

        assertNotNull(response);
        assertEquals("google.jwt.access.token", response.getAccessToken());
        assertEquals("google.jwt.refresh.token", response.getRefreshToken());
        assertEquals("alex.user@gmail.com", response.getUser().getEmail());
        assertEquals(UserRole.CUSTOMER, response.getUser().getRole());

        verify(userRepository).save(any(User.class));
        verify(customerRepository).save(any(Customer.class));
        verify(oauthAccountRepository).save(any(OAuthAccount.class));
    }

    @Test
    @DisplayName("Case 2: Existing Google User logs in directly")
    void testProcessOAuth2User_ExistingGoogleUser() {
        UUID existingUserId = UUID.randomUUID();
        User existingUser = User.builder()
                .name("Alex Johnson")
                .username("alex_johnson")
                .email("alex.user@gmail.com")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .isEmailVerified(true)
                .profileImageUrl("https://lh3.googleusercontent.com/a/photo.jpg")
                .build();
        existingUser.setId(existingUserId);

        OAuthAccount linkedAccount = OAuthAccount.builder()
                .user(existingUser)
                .provider(OAuthProvider.GOOGLE)
                .providerUserId("google-sub-10029384756")
                .email("alex.user@gmail.com")
                .build();

        when(oauthAccountRepository.findByProviderAndProviderUserId(OAuthProvider.GOOGLE, "google-sub-10029384756"))
                .thenReturn(Optional.of(linkedAccount));
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("existing.google.jwt");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("existing.google.refresh");

        AuthResponse response = googleAuthService.processOAuth2User(sampleUserInfo, null);

        assertNotNull(response);
        assertEquals("existing.google.jwt", response.getAccessToken());
        assertEquals("alex.user@gmail.com", response.getUser().getEmail());

        verify(userRepository, never()).findByEmail(anyString());
        verify(customerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Case 3: Existing local user with same email performs safe account linking")
    void testProcessOAuth2User_SafeAccountLinking() {
        UUID localUserId = UUID.randomUUID();
        User localUser = User.builder()
                .name("Alex Johnson")
                .username("alex_j")
                .email("alex.user@gmail.com")
                .phone("9894942355")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .isEmailVerified(false)
                .build();
        localUser.setId(localUserId);

        when(oauthAccountRepository.findByProviderAndProviderUserId(OAuthProvider.GOOGLE, "google-sub-10029384756"))
                .thenReturn(Optional.empty());
        when(userRepository.findByEmail("alex.user@gmail.com"))
                .thenReturn(Optional.of(localUser));
        when(tokenProvider.generateToken(any(UserPrincipal.class))).thenReturn("linked.user.jwt");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("linked.user.refresh");

        AuthResponse response = googleAuthService.processOAuth2User(sampleUserInfo, null);

        assertNotNull(response);
        assertEquals("linked.user.jwt", response.getAccessToken());
        assertTrue(localUser.isEmailVerified(), "Local user email must be marked verified after Google linking");
        assertEquals("https://lh3.googleusercontent.com/a/photo.jpg", localUser.getProfileImageUrl());

        verify(userRepository).save(localUser);
        verify(oauthAccountRepository).save(any(OAuthAccount.class));
        verify(customerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Suspended user attempting Google login is rejected")
    void testProcessOAuth2User_SuspendedUser() {
        User suspendedUser = User.builder()
                .name("Suspended User")
                .email("alex.user@gmail.com")
                .role(UserRole.CUSTOMER)
                .status(UserStatus.SUSPENDED)
                .build();

        OAuthAccount linkedAccount = OAuthAccount.builder()
                .user(suspendedUser)
                .provider(OAuthProvider.GOOGLE)
                .providerUserId("google-sub-10029384756")
                .build();

        when(oauthAccountRepository.findByProviderAndProviderUserId(OAuthProvider.GOOGLE, "google-sub-10029384756"))
                .thenReturn(Optional.of(linkedAccount));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> googleAuthService.processOAuth2User(sampleUserInfo, null));
        assertTrue(ex.getMessage().contains("suspended"));
    }

    @Test
    @DisplayName("Mock Google token verification parses claims successfully")
    void testVerifyGoogleIdToken_MockToken() {
        String mockToken = "mock-google-token:sub-998877:john.doe@gmail.com:John Doe";
        GoogleUserInfo userInfo = googleAuthService.verifyGoogleIdToken(mockToken);

        assertNotNull(userInfo);
        assertEquals("sub-998877", userInfo.getProviderUserId());
        assertEquals("john.doe@gmail.com", userInfo.getEmail());
        assertEquals("John Doe", userInfo.getName());
        assertTrue(userInfo.isEmailVerified());
    }

    @Test
    @DisplayName("Blank Google ID token throws IllegalArgumentException")
    void testVerifyGoogleIdToken_BlankToken() {
        assertThrows(IllegalArgumentException.class, () -> googleAuthService.verifyGoogleIdToken(""));
        assertThrows(IllegalArgumentException.class, () -> googleAuthService.verifyGoogleIdToken(null));
    }
}

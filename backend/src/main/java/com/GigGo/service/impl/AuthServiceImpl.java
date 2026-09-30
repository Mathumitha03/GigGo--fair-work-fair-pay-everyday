package com.GigGo.service.impl;

import com.GigGo.dto.auth.AdminRegisterRequest;
import com.GigGo.dto.auth.AuthResponse;
import com.GigGo.dto.auth.CustomerRegisterRequest;
import com.GigGo.dto.auth.LoginRequest;
import com.GigGo.dto.auth.RefreshTokenRequest;
import com.GigGo.dto.auth.UserProfileDto;
import com.GigGo.dto.auth.WorkerRegisterRequest;
import com.GigGo.entity.authentication.User;
import com.GigGo.entity.profile.Admin;
import com.GigGo.entity.profile.CooperativeManager;
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
import com.GigGo.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.GigGo.dto.auth.AuthValidationConstants;
import com.GigGo.dto.auth.ForgotPasswordRequest;
import com.GigGo.dto.auth.GoogleAuthRequest;
import com.GigGo.dto.auth.ResetPasswordRequest;
import com.GigGo.entity.authentication.PasswordResetToken;
import com.GigGo.repository.PasswordResetTokenRepository;
import com.GigGo.service.EmailService;
import com.GigGo.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Value;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final CooperativeManagerRepository cooperativeManagerRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final GoogleAuthService googleAuthService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Value("${giggo.auth.reset-token-expiration-minutes:${RESET_TOKEN_EXPIRATION_MINUTES:15}}")
    private int resetTokenExpirationMinutes = 15;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Override
    @Transactional
    public AuthResponse registerCustomer(CustomerRegisterRequest request) {
        validateRegistrationUniqueness(request.getPhone(), request.getEmail(), request.getUsername());
        validateStrongPassword(request.getPassword());
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            validateEmailFormat(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName().trim())
                .username(request.getUsername() != null && !request.getUsername().isBlank() ? request.getUsername().trim() : null)
                .phone(request.getPhone().trim())
                .email(request.getEmail() != null && !request.getEmail().isBlank() ? request.getEmail().trim().toLowerCase() : null)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE)
                .languagePreference(request.getLanguagePreference() != null ? request.getLanguagePreference() : "en")
                .isPhoneVerified(true)
                .build();

        user = userRepository.save(user);

        Customer customer = Customer.builder()
                .user(user)
                .defaultAddress(request.getDefaultAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .build();

        customerRepository.save(customer);

        return generateAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse registerWorker(WorkerRegisterRequest request) {
        validateRegistrationUniqueness(request.getPhone(), request.getEmail(), request.getUsername());
        validateStrongPassword(request.getPassword());
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            validateEmailFormat(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName().trim())
                .username(request.getUsername() != null && !request.getUsername().isBlank() ? request.getUsername().trim() : null)
                .phone(request.getPhone().trim())
                .email(request.getEmail() != null && !request.getEmail().isBlank() ? request.getEmail().trim().toLowerCase() : null)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.WORKER)
                .status(UserStatus.ACTIVE)
                .languagePreference(request.getLanguagePreference() != null ? request.getLanguagePreference() : "en")
                .isPhoneVerified(true)
                .build();

        user = userRepository.save(user);

        // Initially worker is UNAFFILIATED and UNVERIFIED
        Worker worker = Worker.builder()
                .user(user)
                .skills(request.getSkills())
                .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 0)
                .upiId(request.getUpiId())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .affiliationStatus(AffiliationStatus.UNAFFILIATED)
                .verificationStatus(WorkerVerificationStatus.UNVERIFIED)
                .isAvailable(true)
                .build();

        workerRepository.save(worker);

        return generateAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse registerAdmin(AdminRegisterRequest request) {
        validateRegistrationUniqueness(request.getPhone(), request.getEmail(), request.getUsername());
        validateStrongPassword(request.getPassword());
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            validateEmailFormat(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName().trim())
                .username(request.getUsername() != null && !request.getUsername().isBlank() ? request.getUsername().trim() : null)
                .phone(request.getPhone().trim())
                .email(request.getEmail() != null && !request.getEmail().isBlank() ? request.getEmail().trim().toLowerCase() : null)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .languagePreference(request.getLanguagePreference() != null ? request.getLanguagePreference() : "en")
                .isPhoneVerified(true)
                .isEmailVerified(true)
                .build();

        user = userRepository.save(user);

        Admin admin = Admin.builder()
                .user(user)
                .department(request.getDepartment() != null ? request.getDepartment() : "Cooperative Federation Administration")
                .superAdmin(false)
                .build();

        adminRepository.save(admin);

        return generateAuthResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();

        // 1. Authenticate with AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Retrieve user
        User user = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new BadCredentialsException("Invalid login credentials"));

        return generateAuthResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!tokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        UUID userId = tokenProvider.getUserIdFromJWT(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found for refresh token"));

        return generateAuthResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        return buildUserProfileDto(user);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        validateEmailFormat(email);

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Invalidate any previously issued active tokens for this user
            passwordResetTokenRepository.invalidateAllActiveTokensForUser(user, Instant.now());

            // Generate cryptographically secure token (64 hex characters)
            byte[] randomBytes = new byte[32];
            SECURE_RANDOM.nextBytes(randomBytes);
            String rawToken = HexFormat.of().formatHex(randomBytes);

            Instant expiresAt = Instant.now().plus(Duration.ofMinutes(resetTokenExpirationMinutes));

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .token(rawToken)
                    .expiresAt(expiresAt)
                    .isUsed(false)
                    .build();

            passwordResetTokenRepository.save(resetToken);

            // Send password reset email
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), rawToken);
            log.info("Password reset request processed for email '{}' (User ID: {})", email, user.getId());
        } else {
            // Avoid user enumeration: log privately and continue
            log.info("Password reset requested for non-existent email '{}'", email);
        }
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        validateStrongPassword(request.getNewPassword());

        String tokenString = request.getToken().trim();

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(tokenString)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token"));

        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("This password reset token has already been used");
        }

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Password reset token has expired. Please request a new one");
        }

        User user = resetToken.getUser();
        if (user == null) {
            throw new IllegalArgumentException("Invalid password reset token: associated user not found");
        }

        // Update password with existing password encoder
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        resetToken.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(resetToken);

        log.info("Password reset successfully completed for user ID: {}", user.getId());
    }

    @Override
    @Transactional
    public AuthResponse googleLogin(GoogleAuthRequest request) {
        return googleAuthService.authenticateGoogleUser(request);
    }

    private void validateEmailFormat(String email) {
        if (!AuthValidationConstants.isValidEmail(email)) {
            throw new IllegalArgumentException(AuthValidationConstants.EMAIL_INVALID_MESSAGE);
        }
    }

    private void validateStrongPassword(String password) {
        if (!AuthValidationConstants.isValidPassword(password)) {
            throw new IllegalArgumentException(AuthValidationConstants.PASSWORD_INVALID_MESSAGE);
        }
    }

    private void validateRegistrationUniqueness(String phone, String email, String username) {
        if (phone != null && !phone.isBlank() && userRepository.existsByPhone(phone.trim())) {
            throw new IllegalArgumentException("A user with phone number '" + phone + "' already exists");
        }
        if (email != null && !email.isBlank() && userRepository.existsByEmail(email.trim().toLowerCase())) {
            throw new IllegalArgumentException("A user with email '" + email + "' already exists");
        }
        if (username != null && !username.isBlank() && userRepository.existsByUsername(username.trim())) {
            throw new IllegalArgumentException("A user with username '" + username + "' already exists");
        }
    }

    private AuthResponse generateAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L / 1000) // in seconds
                .user(buildUserProfileDto(user))
                .build();
    }

    private UserProfileDto buildUserProfileDto(User user) {
        UserProfileDto.UserProfileDtoBuilder builder = UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .languagePreference(user.getLanguagePreference())
                .profileImageUrl(user.getProfileImageUrl());

        // Worker details
        Optional<Worker> workerOpt = workerRepository.findByUserId(user.getId());
        if (workerOpt.isPresent()) {
            Worker worker = workerOpt.get();
            builder.workerId(worker.getId())
                    .isAffiliated(worker.isAffiliated())
                    .affiliationStatus(worker.getAffiliationStatus())
                    .verificationStatus(worker.getVerificationStatus())
                    .skills(worker.getSkills())
                    .experienceYears(worker.getExperienceYears())
                    .currentRating(worker.getCurrentRating())
                    .totalGigsCompleted(worker.getTotalGigsCompleted())
                    .welfareMemberId(worker.getWelfareMemberId())
                    .insurancePolicyNumber(worker.getInsurancePolicyNumber());

            if (worker.getPrimaryCooperative() != null) {
                builder.primaryCooperativeId(worker.getPrimaryCooperative().getId())
                        .primaryCooperativeName(worker.getPrimaryCooperative().getName());
            }
        }

        // Cooperative Manager details
        Optional<CooperativeManager> managerOpt = cooperativeManagerRepository.findByUserId(user.getId());
        if (managerOpt.isPresent()) {
            CooperativeManager manager = managerOpt.get();
            builder.managerId(manager.getId())
                    .designation(manager.getDesignation());
            if (manager.getCooperative() != null) {
                builder.managedCooperativeId(manager.getCooperative().getId())
                        .managedCooperativeName(manager.getCooperative().getName());
            }
        }

        // Customer details
        Optional<Customer> customerOpt = customerRepository.findByUserId(user.getId());
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            builder.customerId(customer.getId())
                    .defaultAddress(customer.getDefaultAddress())
                    .city(customer.getCity())
                    .state(customer.getState());
        }

        // Admin details
        Optional<Admin> adminOpt = adminRepository.findByUserId(user.getId());
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            builder.adminId(admin.getId())
                    .department(admin.getDepartment())
                    .isSuperAdmin(admin.isSuperAdmin());
        }

        return builder.build();
    }
}

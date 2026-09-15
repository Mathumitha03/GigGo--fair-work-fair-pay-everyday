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
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public AuthResponse registerCustomer(CustomerRegisterRequest request) {
        validateRegistrationUniqueness(request.getPhone(), request.getEmail(), request.getUsername());

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

package com.GigGo.config;

import com.GigGo.entity.authentication.User;
import com.GigGo.entity.cooperative.CooperativeMembership;
import com.GigGo.entity.cooperative.LabourCooperative;
import com.GigGo.entity.profile.Admin;
import com.GigGo.entity.profile.CooperativeManager;
import com.GigGo.entity.profile.Worker;
import com.GigGo.entity.service.ServiceCategory;
import com.GigGo.enums.AffiliationStatus;
import com.GigGo.enums.MembershipStatus;
import com.GigGo.enums.UserRole;
import com.GigGo.enums.UserStatus;
import com.GigGo.enums.WorkerVerificationStatus;
import com.GigGo.repository.AdminRepository;
import com.GigGo.repository.CooperativeManagerRepository;
import com.GigGo.repository.CooperativeMembershipRepository;
import com.GigGo.repository.LabourCooperativeRepository;
import com.GigGo.repository.ServiceCategoryRepository;
import com.GigGo.repository.UserRepository;
import com.GigGo.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final WorkerRepository workerRepository;
    private final CooperativeManagerRepository cooperativeManagerRepository;
    private final LabourCooperativeRepository cooperativeRepository;
    private final CooperativeMembershipRepository membershipRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting GigGo Data Initialization & Idempotency Check...");

        seedFederationAdmin();
        seedServiceCategories();
        seedSampleCooperativeAndUsers();

        log.info("GigGo Data Initialization completed successfully.");
    }

    /**
     * Seeds default Federation Super Admin with Idempotency Guard.
     * Login credentials:
     * Phone: 9894942303
     * Email: admin@giggo.coop
     * Username: admin
     * Password: Admin@GigGo2026
     */
    private void seedFederationAdmin() {
        String adminEmail = "admin@giggo.coop";
        String adminPhone = "9894942303";
        String adminUsername = "admin";

        // Idempotency guard
        if (userRepository.existsByEmail(adminEmail) || userRepository.existsByPhone(adminPhone) || userRepository.existsByUsername(adminUsername)) {
            log.info("Default Federation Admin already exists in database. Skipping creation.");
            return;
        }

        User adminUser = User.builder()
                .name("Cooperative Federation Super Admin")
                .username(adminUsername)
                .email(adminEmail)
                .phone(adminPhone)
                .passwordHash(passwordEncoder.encode("Admin@GigGo2026"))
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .languagePreference("en")
                .isEmailVerified(true)
                .isPhoneVerified(true)
                .build();

        adminUser = userRepository.save(adminUser);

        Admin adminProfile = Admin.builder()
                .user(adminUser)
                .department("Cooperative Federation Headquarters")
                .permissions("ALL_PERMISSIONS,APPROVE_COOPERATIVES,MANAGE_DISPUTES,FEDERATION_GOVERNANCE")
                .superAdmin(true)
                .build();

        adminRepository.save(adminProfile);

        log.info("Default Federation Admin initialized: Phone='{}', Email='{}', Username='{}'",
                adminPhone, adminEmail, adminUsername);
    }

    /**
     * Seeds essential service categories if empty.
     */
    private void seedServiceCategories() {
        if (serviceCategoryRepository.count() > 0) {
            log.info("Service categories already populated (count: {}). Skipping seeding.", serviceCategoryRepository.count());
            return;
        }

        List<ServiceCategory> categories = List.of(
                ServiceCategory.builder().name("Electrician").slug("electrician").description("Electrical wiring, installations, repairs, and fault detection").basePrice(new BigDecimal("350.00")).displayOrder(1).build(),
                ServiceCategory.builder().name("Plumber").slug("plumber").description("Pipe fitting, leakage repair, bathroom & kitchen plumbing services").basePrice(new BigDecimal("300.00")).displayOrder(2).build(),
                ServiceCategory.builder().name("Carpenter").slug("carpenter").description("Furniture repair, woodwork, modular cabinetry and fixtures").basePrice(new BigDecimal("400.00")).displayOrder(3).build(),
                ServiceCategory.builder().name("Painter").slug("painter").description("Interior, exterior wall painting, touchups and waterproofing").basePrice(new BigDecimal("450.00")).displayOrder(4).build(),
                ServiceCategory.builder().name("Domestic Helper").slug("domestic-helper").description("Household daily chores, dusting, utensil cleaning and assistance").basePrice(new BigDecimal("250.00")).displayOrder(5).build(),
                ServiceCategory.builder().name("Caregiver").slug("caregiver").description("Elderly care, patient care, nursing assistance and companionship").basePrice(new BigDecimal("500.00")).displayOrder(6).build(),
                ServiceCategory.builder().name("Driver").slug("driver").description("Personal and commercial on-demand chauffeuring services").basePrice(new BigDecimal("350.00")).displayOrder(7).build(),
                ServiceCategory.builder().name("Gardener").slug("gardener").description("Lawn maintenance, plant trimming, landscaping and garden care").basePrice(new BigDecimal("280.00")).displayOrder(8).build(),
                ServiceCategory.builder().name("Cleaner").slug("cleaner").description("Deep house cleaning, kitchen scrubbing, bathroom sanitization").basePrice(new BigDecimal("400.00")).displayOrder(9).build(),
                ServiceCategory.builder().name("Technician").slug("technician").description("Appliance repair for AC, refrigerator, washing machine and microwave").basePrice(new BigDecimal("450.00")).displayOrder(10).build()
        );

        serviceCategoryRepository.saveAll(categories);
        log.info("Seeded {} standard cooperative service categories.", categories.size());
    }

    /**
     * Seeds a baseline demo Labour Cooperative Society with a Moderator & an Affiliated Worker for instant verification.
     */
    private void seedSampleCooperativeAndUsers() {
        String coopRegNum = "TN-COOP-2026-001";
        if (cooperativeRepository.existsByRegistrationNumber(coopRegNum)) {
            return;
        }

        // 1. Create Sample Labour Cooperative
        LabourCooperative coop = LabourCooperative.builder()
                .name("Apex Labour Cooperative Society")
                .registrationNumber(coopRegNum)
                .region("Chennai Central")
                .address("12 Federation Plaza, Mount Road, Chennai, Tamil Nadu")
                .contactEmail("contact@apexcoop.org")
                .contactPhone("9894942300")
                .description("Cooperative society representing certified electricians, plumbers, and technicians with social security and fair wages.")
                .commissionRate(new BigDecimal("5.00"))
                .welfareFundBalance(new BigDecimal("50000.00"))
                .insuranceSchemeDetails("Pradhan Mantri Suraksha Bima Yojana (PMSBY) + Cooperative Health Micro-Insurance")
                .isActive(true)
                .build();

        coop = cooperativeRepository.save(coop);

        // 2. Create Sample Cooperative Manager / Moderator
        String managerPhone = "9894942301";
        if (!userRepository.existsByPhone(managerPhone)) {
            User managerUser = User.builder()
                    .name("Ramesh Kumar (Society Manager)")
                    .username("moderator_ramesh")
                    .email("ramesh@apexcoop.org")
                    .phone(managerPhone)
                    .passwordHash(passwordEncoder.encode("Manager@123"))
                    .role(UserRole.COOPERATIVE_MANAGER)
                    .status(UserStatus.ACTIVE)
                    .languagePreference("ta")
                    .isPhoneVerified(true)
                    .build();

            managerUser = userRepository.save(managerUser);

            CooperativeManager manager = CooperativeManager.builder()
                    .user(managerUser)
                    .cooperative(coop)
                    .designation("General Secretary / Society Moderator")
                    .employeeCode("APEX-MGR-001")
                    .build();

            cooperativeManagerRepository.save(manager);
        }

        // 3. Create Sample Affiliated Worker
        String workerPhone = "9894942302";
        if (!userRepository.existsByPhone(workerPhone)) {
            User workerUser = User.builder()
                    .name("Murugan (Electrician)")
                    .username("worker_murugan")
                    .email("murugan@giggo.coop")
                    .phone(workerPhone)
                    .passwordHash(passwordEncoder.encode("Worker@123"))
                    .role(UserRole.WORKER)
                    .status(UserStatus.ACTIVE)
                    .languagePreference("ta")
                    .isPhoneVerified(true)
                    .build();

            workerUser = userRepository.save(workerUser);

            Worker worker = Worker.builder()
                    .user(workerUser)
                    .primaryCooperative(coop)
                    .skills("Electrician, Wiring, Inverter Repair")
                    .experienceYears(8)
                    .verificationStatus(WorkerVerificationStatus.VERIFIED)
                    .affiliationStatus(AffiliationStatus.AFFILIATED)
                    .welfareMemberId("APEX-MEM-108")
                    .insurancePolicyNumber("PMSBY-APEX-8899")
                    .emergencyContactName("Selvi (Spouse)")
                    .emergencyContactPhone("9894942399")
                    .hourlyRate(new BigDecimal("350.00"))
                    .currentRating(new BigDecimal("4.85"))
                    .totalRatingsCount(42)
                    .totalGigsCompleted(68)
                    .isAvailable(true)
                    .build();

            worker = workerRepository.save(worker);

            CooperativeMembership membership = CooperativeMembership.builder()
                    .worker(worker)
                    .cooperative(coop)
                    .joinDate(LocalDate.of(2026, 1, 15))
                    .membershipNumber("APEX-MEM-108")
                    .status(MembershipStatus.ACTIVE)
                    .verifiedAt(Instant.now())
                    .requestNotes("Founding electrician member")
                    .build();

            membershipRepository.save(membership);
        }

        log.info("Seeded sample Labour Cooperative Society and users for development testing.");
    }
}

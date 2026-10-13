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
import com.GigGo.entity.service.ServiceProblem;
import com.GigGo.repository.ServiceProblemRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    private final ServiceProblemRepository serviceProblemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting GigGo Data Initialization & Idempotency Check...");

        seedFederationAdmin();
        seedServiceCategoriesAndProblems();
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
     * Seeds essential service categories and guarantees their associated problems exist.
     */
    private void seedServiceCategoriesAndProblems() {
        // 1. Ensure primary required categories exist
        List<ServiceCategory> requiredCategories = List.of(
                ServiceCategory.builder().name("CARPENTER").slug("carpenter").description("Furniture repair, woodwork, modular cabinetry and fixtures").basePrice(new BigDecimal("400.00")).displayOrder(1).build(),
                ServiceCategory.builder().name("PAINTER").slug("painter").description("Interior, exterior wall painting, touchups and waterproofing").basePrice(new BigDecimal("450.00")).displayOrder(2).build(),
                ServiceCategory.builder().name("CLEANER").slug("cleaner").description("Deep house cleaning, kitchen scrubbing, bathroom sanitization").basePrice(new BigDecimal("400.00")).displayOrder(3).build(),
                ServiceCategory.builder().name("GARDEN_CLEANER").slug("garden-cleaner").description("Lawn maintenance, plant trimming, landscaping and garden care").basePrice(new BigDecimal("280.00")).displayOrder(4).build(),
                ServiceCategory.builder().name("Electrician").slug("electrician").description("Electrical wiring, installations, repairs, and fault detection").basePrice(new BigDecimal("350.00")).displayOrder(5).build(),
                ServiceCategory.builder().name("Plumber").slug("plumber").description("Pipe fitting, leakage repair, bathroom & kitchen plumbing services").basePrice(new BigDecimal("300.00")).displayOrder(6).build()
        );

        for (ServiceCategory reqCat : requiredCategories) {
            if (!serviceCategoryRepository.existsBySlug(reqCat.getSlug()) && !serviceCategoryRepository.existsByName(reqCat.getName())) {
                serviceCategoryRepository.save(reqCat);
                log.info("Saved required service category: '{}'", reqCat.getName());
            }
        }

        // 2. Iterate through ALL categories in the database and ensure every category has problems linked to it
        List<ServiceCategory> allCategories = serviceCategoryRepository.findAll();
        List<ServiceProblem> newProblemsToSave = new ArrayList<>();

        for (ServiceCategory cat : allCategories) {
            List<ServiceProblem> existingProblems = serviceProblemRepository.findByCategoryId(cat.getId());
            if (!existingProblems.isEmpty()) {
                continue; // Category already has problems configured in DB
            }

            String identifier = (cat.getName() + " " + cat.getSlug()).toLowerCase();

            if (identifier.contains("carpenter")) {
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Door Repair").description("Fix wooden door hinges, lock alignment, or frame damage").estimatedPrice(new BigDecimal("350.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Furniture Repair").description("Table, chair, bed frame repair and polishing").estimatedPrice(new BigDecimal("450.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Cupboard Repair").description("Cabinet door fixing, shelf alignment and hinge replacement").estimatedPrice(new BigDecimal("400.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Window Repair").description("Wooden window sash, latch, and frame repairs").estimatedPrice(new BigDecimal("300.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Other Carpenter Problem").description("General custom carpentry repair and woodwork").estimatedPrice(new BigDecimal("350.00")).build());
            } else if (identifier.contains("paint")) {
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Wall Painting").description("Single or multi-room wall interior painting").estimatedPrice(new BigDecimal("800.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Ceiling Painting").description("Ceiling coat, crack filling, and whitewashing").estimatedPrice(new BigDecimal("600.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Door Painting").description("Door, window frame, and enamel paint coating").estimatedPrice(new BigDecimal("350.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Exterior Painting").description("Weatherproof exterior building wall painting").estimatedPrice(new BigDecimal("1200.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Other Painting Problem").description("Patching wall scratches, dampness treatment, and touch-ups").estimatedPrice(new BigDecimal("400.00")).build());
            } else if (identifier.contains("clean") && !identifier.contains("garden")) {
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("House Cleaning").description("Complete home sanitization, dusting, and mopping").estimatedPrice(new BigDecimal("600.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Bathroom Cleaning").description("Tile descaling, toilet scrubbing, and disinfected bathroom wash").estimatedPrice(new BigDecimal("350.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Kitchen Cleaning").description("Deep kitchen counter, chimney, and appliance degreasing").estimatedPrice(new BigDecimal("450.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Deep Cleaning").description("Full house deep scrub, upholstery shampooing, and vacuuming").estimatedPrice(new BigDecimal("800.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Other Cleaning Problem").description("Custom household cleaning request").estimatedPrice(new BigDecimal("350.00")).build());
            } else if (identifier.contains("garden")) {
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Garden Cleaning").description("Lawn sweeping, yard cleanup, and garden waste collection").estimatedPrice(new BigDecimal("300.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Grass Cutting").description("Lawn grass cutting, edge trimming, and weed removal").estimatedPrice(new BigDecimal("250.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Plant Maintenance").description("Shrub pruning, plant watering, and fertilizer application").estimatedPrice(new BigDecimal("350.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Garden Waste Removal").description("Foliage waste bagging, branch disposal, and clearing").estimatedPrice(new BigDecimal("250.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Other Garden Problem").description("Tree branch pruning and general landscaping care").estimatedPrice(new BigDecimal("400.00")).build());
            } else if (identifier.contains("electric")) {
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Wiring Fault Repair").description("Short circuit fix and wiring inspection").estimatedPrice(new BigDecimal("350.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Switchboard Repair").description("Socket, switch, and fuse replacement").estimatedPrice(new BigDecimal("250.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Fan Installation").description("Ceiling or exhaust fan assembly and mounting").estimatedPrice(new BigDecimal("300.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Appliance Power Fix").description("Inverter, MCB, or main line troubleshooting").estimatedPrice(new BigDecimal("400.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Other Electrical Problem").description("General electrical fixture repair").estimatedPrice(new BigDecimal("300.00")).build());
            } else if (identifier.contains("plumb")) {
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Pipe Leakage Repair").description("Fixing water pipe leaks and joint sealing").estimatedPrice(new BigDecimal("300.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Tap & Faucet Repair").description("Kitchen/bathroom tap washer or fixture replacement").estimatedPrice(new BigDecimal("250.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Blocked Drain Cleaning").description("Unclogging sink, shower, or drain pipes").estimatedPrice(new BigDecimal("350.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Toilet Fixture Repair").description("Flush tank, flush valve, or seal repair").estimatedPrice(new BigDecimal("400.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Other Plumbing Problem").description("General plumbing fixture repair").estimatedPrice(new BigDecimal("300.00")).build());
            } else {
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Standard Repair & Maintenance").description("General service repair for " + cat.getName()).estimatedPrice(new BigDecimal("350.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Diagnostic & Inspection").description("Inspection and fault diagnosis").estimatedPrice(new BigDecimal("200.00")).build());
                newProblemsToSave.add(ServiceProblem.builder().category(cat).name("Custom Service Request").description("Custom service request for " + cat.getName()).estimatedPrice(new BigDecimal("400.00")).build());
            }
        }

        if (!newProblemsToSave.isEmpty()) {
            serviceProblemRepository.saveAll(newProblemsToSave);
            log.info("Seeded {} new service problems across existing service categories.", newProblemsToSave.size());
        }
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

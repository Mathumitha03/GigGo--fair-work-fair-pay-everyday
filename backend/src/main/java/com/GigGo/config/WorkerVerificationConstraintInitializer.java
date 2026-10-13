package com.GigGo.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Ensures PostgreSQL check constraint 'workers_verification_status_check' allows 'ID_VERIFIED'.
 * Executed on startup prior to data seeding and service requests.
 */
@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class WorkerVerificationConstraintInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            log.info("Ensuring PostgreSQL workers_verification_status_check constraint permits 'ID_VERIFIED'...");
            jdbcTemplate.execute("ALTER TABLE workers DROP CONSTRAINT IF EXISTS workers_verification_status_check");
            jdbcTemplate.execute("ALTER TABLE workers ADD CONSTRAINT workers_verification_status_check " +
                    "CHECK (verification_status IN ('UNVERIFIED', 'ID_VERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'))");
            log.info("PostgreSQL constraint workers_verification_status_check verified and updated successfully.");
        } catch (Exception e) {
            log.warn("Constraint check update skipped/deferred: {}", e.getMessage());
        }
    }
}

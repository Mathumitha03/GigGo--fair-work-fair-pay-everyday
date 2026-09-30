package com.GigGo;

import com.GigGo.dto.auth.AuthValidationConstants;
import com.GigGo.dto.auth.CustomerRegisterRequest;
import com.GigGo.dto.auth.ForgotPasswordRequest;
import com.GigGo.dto.auth.ResetPasswordRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AuthValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    // =========================================================================
    // 1. Email Validation Tests
    // =========================================================================

    @ParameterizedTest
    @ValueSource(strings = {
            "test@gmail.com",
            "test@example.com",
            "user.name+tag@giggo.coop",
            "mathu@domain.org"
    })
    @DisplayName("Valid emails pass email validation")
    void testValidEmails(String validEmail) {
        assertTrue(AuthValidationConstants.isValidEmail(validEmail),
                "Expected email to be valid: " + validEmail);

        ForgotPasswordRequest request = ForgotPasswordRequest.builder()
                .email(validEmail)
                .build();

        Set<ConstraintViolation<ForgotPasswordRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Expected no bean validation violations for: " + validEmail);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "testgmail.com",
            "mathu.com",
            "user@gmail",
            "@missinguser.com",
            "plainaddress",
            ""
    })
    @DisplayName("Invalid emails fail email validation")
    void testInvalidEmails(String invalidEmail) {
        assertFalse(AuthValidationConstants.isValidEmail(invalidEmail),
                "Expected email to be invalid: " + invalidEmail);

        ForgotPasswordRequest request = ForgotPasswordRequest.builder()
                .email(invalidEmail)
                .build();

        Set<ConstraintViolation<ForgotPasswordRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "Expected bean validation violations for invalid email: " + invalidEmail);
    }

    // =========================================================================
    // 2. Strong Password Validation Tests
    // =========================================================================

    @ParameterizedTest
    @ValueSource(strings = {
            "Mathu@123",
            "Password_1",
            "Hello*123",
            "Secure@2026",
            "Admin@GigGo2026",
            "Worker_99!",
            "Complex#Password2026"
    })
    @DisplayName("Valid strong passwords satisfy all requirements (uppercase, number, special char, 8+ chars)")
    void testValidStrongPasswords(String validPassword) {
        assertTrue(AuthValidationConstants.isValidPassword(validPassword),
                "Expected password to be valid: " + validPassword);

        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .token("valid-token")
                .newPassword(validPassword)
                .build();

        Set<ConstraintViolation<ResetPasswordRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Expected no bean validation violations for: " + validPassword);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "password123",   // No uppercase, no special character
            "Password123",   // No special character
            "password@123",  // No uppercase letter
            "Password@abc",  // No number
            "Pass@1",        // Less than 8 characters (6 chars)
            "P@1",           // Less than 8 characters (3 chars)
            "12345678",      // Numbers only
            "ABCDEFGH",      // Uppercase only
            "abcdefgh",      // Lowercase only
            "!@#$%^&*"       // Specials only
    })
    @DisplayName("Invalid passwords fail strong password validation")
    void testInvalidPasswords(String invalidPassword) {
        assertFalse(AuthValidationConstants.isValidPassword(invalidPassword),
                "Expected password to be invalid: " + invalidPassword);

        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .token("valid-token")
                .newPassword(invalidPassword)
                .build();

        Set<ConstraintViolation<ResetPasswordRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty(), "Expected bean validation violations for invalid password: " + invalidPassword);
    }

    // =========================================================================
    // 3. Customer Registration Bean Validation
    // =========================================================================

    @Test
    @DisplayName("CustomerRegisterRequest with valid strong password and email passes validation")
    void testCustomerRegisterRequest_Valid() {
        CustomerRegisterRequest request = CustomerRegisterRequest.builder()
                .name("Kavitha")
                .phone("9894942350")
                .email("kavitha@example.com")
                .password("Mathu@123")
                .build();

        Set<ConstraintViolation<CustomerRegisterRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("CustomerRegisterRequest with weak password fails validation")
    void testCustomerRegisterRequest_WeakPassword() {
        CustomerRegisterRequest request = CustomerRegisterRequest.builder()
                .name("Kavitha")
                .phone("9894942350")
                .email("kavitha@example.com")
                .password("password123")
                .build();

        Set<ConstraintViolation<CustomerRegisterRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    @DisplayName("CustomerRegisterRequest with invalid email fails validation")
    void testCustomerRegisterRequest_InvalidEmail() {
        CustomerRegisterRequest request = CustomerRegisterRequest.builder()
                .name("Kavitha")
                .phone("9894942350")
                .email("kavithaexample.com")
                .password("Mathu@123")
                .build();

        Set<ConstraintViolation<CustomerRegisterRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }
}

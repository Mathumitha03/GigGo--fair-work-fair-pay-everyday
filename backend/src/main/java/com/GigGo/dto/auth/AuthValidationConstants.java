package com.GigGo.dto.auth;

import java.util.regex.Pattern;

public final class AuthValidationConstants {

    private AuthValidationConstants() {}

    /**
     * Email Regex requiring proper mailbox, '@', and valid top-level domain.
     */
    public static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    public static final String EMAIL_INVALID_MESSAGE = "Please enter a valid email address.";

    /**
     * Strong Password Regex requiring at least 8 characters, 1 uppercase letter, 1 number, and 1 special character (_, *, @, etc.).
     */
    public static final String PASSWORD_REGEX = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\\s]).{8,}$";
    public static final String PASSWORD_INVALID_MESSAGE = "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character (_, *, @, etc.)";

    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }
}

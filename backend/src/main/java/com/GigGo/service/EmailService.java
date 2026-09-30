package com.GigGo.service;

public interface EmailService {

    /**
     * Sends a secure password reset email containing a reset link with the provided token.
     *
     * @param toEmail       recipient's email address
     * @param recipientName recipient's display name
     * @param resetToken    secure one-time password reset token
     */
    void sendPasswordResetEmail(String toEmail, String recipientName, String resetToken);
}

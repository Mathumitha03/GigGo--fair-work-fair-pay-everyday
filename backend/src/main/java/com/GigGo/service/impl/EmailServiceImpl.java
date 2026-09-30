package com.GigGo.service.impl;

import com.GigGo.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${giggo.mail.frontend-url:${FRONTEND_URL:http://localhost:5173}}")
    private String frontendUrl;

    @Value("${giggo.mail.from:${MAIL_FROM:admingiggo@gmail.com}}")
    private String mailFrom;

    @Value("${giggo.auth.reset-token-expiration-minutes:${RESET_TOKEN_EXPIRATION_MINUTES:15}}")
    private int resetTokenExpirationMinutes;

    @Autowired(required = false)
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String recipientName, String resetToken) {
        String cleanFrontendUrl = frontendUrl != null ? frontendUrl.replaceAll("/+$", "") : "http://localhost:5173";
        String resetUrl = cleanFrontendUrl + "/reset-password?token=" + resetToken;

        String subject = "GigGo — Password Reset Request";
        String htmlContent = buildPasswordResetHtml(recipientName, resetUrl);

        if (mailSender == null) {
            log.warn("JavaMailSender is not configured. Reset password link for email '{}': {}", toEmail, resetUrl);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());

            helper.setFrom(mailFrom);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email successfully sent to '{}'", toEmail);
        } catch (Exception ex) {
            log.error("Failed to send password reset email to '{}': {}. Fallback reset URL for dev: {}", toEmail, ex.getMessage(), resetUrl);
        }
    }

    private String buildPasswordResetHtml(String recipientName, String resetUrl) {
        String name = recipientName != null && !recipientName.isBlank() ? recipientName : "Valued Member";
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head><meta charset=\"UTF-8\"><title>GigGo Password Reset</title></head>"
                + "<body style=\"font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;\">"
                + "  <div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);\">"
                + "    <div style=\"background-color: #1a56db; padding: 24px; text-align: center; color: #ffffff;\">"
                + "      <h1 style=\"margin: 0; font-size: 24px; font-weight: bold;\">GigGo</h1>"
                + "      <p style=\"margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;\">Fair Work, Fair Pay, Everyday</p>"
                + "    </div>"
                + "    <div style=\"padding: 32px 24px; color: #374151;\">"
                + "      <h2 style=\"margin-top: 0; font-size: 20px; color: #111827;\">Password Reset Request</h2>"
                + "      <p>Hello <strong>" + escapeHtml(name) + "</strong>,</p>"
                + "      <p>We received a request to reset your password for your GigGo account. Click the button below to set a new password:</p>"
                + "      <div style=\"text-align: center; margin: 30px 0;\">"
                + "        <a href=\"" + resetUrl + "\" style=\"background-color: #1a56db; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">Reset Password</a>"
                + "      </div>"
                + "      <p style=\"font-size: 14px; color: #6b7280;\">This link is valid for <strong>" + resetTokenExpirationMinutes + " minutes</strong> and can only be used once.</p>"
                + "      <p style=\"font-size: 14px; color: #6b7280;\">If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>"
                + "      <hr style=\"border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;\" />"
                + "      <p style=\"font-size: 12px; color: #9ca3af; word-break: break-all;\">If the button doesn't work, copy and paste this link into your browser:<br/><a href=\"" + resetUrl + "\" style=\"color: #1a56db;\">" + resetUrl + "</a></p>"
                + "    </div>"
                + "  </div>"
                + "</body>"
                + "</html>";
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}

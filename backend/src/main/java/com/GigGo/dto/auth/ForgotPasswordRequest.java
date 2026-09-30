package com.GigGo.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForgotPasswordRequest {

    @NotBlank(message = "Email address is required")
    @Email(regexp = AuthValidationConstants.EMAIL_REGEX, message = AuthValidationConstants.EMAIL_INVALID_MESSAGE)
    private String email;
}

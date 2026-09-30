package com.GigGo.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class AdminRegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 50)
    private String username;

    @NotBlank(message = "Phone number is required")
    @Size(max = 20)
    private String phone;

    @Email(regexp = AuthValidationConstants.EMAIL_REGEX, message = AuthValidationConstants.EMAIL_INVALID_MESSAGE)
    @Size(max = 150)
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = AuthValidationConstants.PASSWORD_REGEX, message = AuthValidationConstants.PASSWORD_INVALID_MESSAGE)
    private String password;

    private String department;
    private String languagePreference;
}

package com.GigGo.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class WorkerRegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @Size(max = 50)
    private String username;

    @NotBlank(message = "Phone number is required")
    @Size(max = 20)
    private String phone;

    @Email(message = "Invalid email format")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    /**
     * Comma-separated skill names, e.g. "Electrician, Plumber"
     */
    private String skills;

    @Builder.Default
    private Integer experienceYears = 0;

    private String upiId;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String languagePreference;
}

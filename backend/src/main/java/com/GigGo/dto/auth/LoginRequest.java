package com.GigGo.dto.auth;

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
public class LoginRequest {

    /**
     * Can be email address, username, or phone number.
     */
    @NotBlank(message = "Login identifier (email, username, or phone number) is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;
}

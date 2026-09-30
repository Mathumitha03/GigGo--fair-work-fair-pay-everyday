package com.GigGo.dto.auth;

import com.GigGo.enums.UserRole;
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
public class GoogleAuthRequest {

    /**
     * Google ID Token (JWT) or OAuth2 Access Token received on the client side from Google Sign-In.
     */
    @NotBlank(message = "Google ID token or authorization credential is required")
    private String idToken;

    /**
     * Optional role to assign if a new user is created. Defaults to CUSTOMER if not provided or unauthorized.
     */
    private UserRole role;
}

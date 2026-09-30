package com.GigGo.service;

import com.GigGo.dto.auth.AuthResponse;
import com.GigGo.dto.auth.GoogleAuthRequest;
import com.GigGo.dto.auth.GoogleUserInfo;
import com.GigGo.enums.UserRole;

public interface GoogleAuthService {

    /**
     * Authenticates a user using a Google ID token or OAuth credential sent from frontend.
     *
     * @param request GoogleAuthRequest containing idToken and optional requested role
     * @return AuthResponse with JWT access & refresh tokens and user profile
     */
    AuthResponse authenticateGoogleUser(GoogleAuthRequest request);

    /**
     * Processes verified Google user info (links existing account or creates new user) and issues JWT.
     *
     * @param userInfo      verified Google user profile details
     * @param requestedRole role to assign if user is newly created (defaults to CUSTOMER)
     * @return AuthResponse with JWT access & refresh tokens and user profile
     */
    AuthResponse processOAuth2User(GoogleUserInfo userInfo, UserRole requestedRole);

    /**
     * Verifies Google ID token against Google OAuth2 tokeninfo endpoint or JWT claims.
     *
     * @param idToken raw Google ID token string
     * @return GoogleUserInfo containing sub, email, name, avatar, emailVerified
     */
    GoogleUserInfo verifyGoogleIdToken(String idToken);
}

package com.GigGo.security.oauth2;

import com.GigGo.dto.auth.AuthResponse;
import com.GigGo.dto.auth.GoogleUserInfo;
import com.GigGo.enums.UserRole;
import com.GigGo.service.GoogleAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final GoogleAuthService googleAuthService;

    @Value("${giggo.mail.frontend-url:${FRONTEND_URL:http://localhost:5173}}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String sub = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        Boolean emailVerified = (Boolean) attributes.get("email_verified");

        GoogleUserInfo userInfo = GoogleUserInfo.builder()
                .providerUserId(sub)
                .email(email)
                .name(name)
                .picture(picture)
                .emailVerified(emailVerified != null ? emailVerified : true)
                .build();

        AuthResponse authResponse = googleAuthService.processOAuth2User(userInfo, UserRole.CUSTOMER);

        String cleanFrontendUrl = frontendUrl != null ? frontendUrl.replaceAll("/+$", "") : "http://localhost:5173";

        return UriComponentsBuilder.fromUriString(cleanFrontendUrl + "/oauth2/redirect")
                .queryParam("token", authResponse.getAccessToken())
                .queryParam("refreshToken", authResponse.getRefreshToken())
                .queryParam("tokenType", authResponse.getTokenType())
                .queryParam("expiresIn", authResponse.getExpiresIn())
                .build().toUriString();
    }
}

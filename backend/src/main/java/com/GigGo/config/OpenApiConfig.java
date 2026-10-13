package com.GigGo.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public OpenAPI gigGoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("GigGo Platform API")
                        .description("Decentralized & Cooperative Gig-Economy Platform - Fair Work, Fair Pay Everyday.\n\n"
                                + "To test protected endpoints:\n"
                                + "1. Call `/api/v1/auth/login` to obtain an `accessToken`.\n"
                                + "2. Click **Authorize** (top right) and paste the token.\n"
                                + "3. All subsequent requests in Swagger UI will automatically include the `Authorization: Bearer <token>` header.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("GigGo Engineering")
                                .email("support@giggo.coop")
                                .url("https://giggo.coop"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .in(SecurityScheme.In.HEADER)
                                .description("Enter your JWT token (without the 'Bearer ' prefix). Swagger UI will automatically prefix with 'Bearer '.")));
    }
}

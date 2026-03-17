package com.example.inka_backend.config;

import com.example.inka_backend.security.JwtAuthenticationFilter;
import com.example.inka_backend.service.CustomOAuth2CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomSuccessHandler customSuccessHandler;   // your existing handler ✓

    @Autowired
    private CustomOAuth2CustomerService customOAuth2CustomerService; // new service ✓

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF off — we use JWT not cookies
            .csrf(csrf -> csrf.disable())

            // Stateless — no server sessions
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // Google OAuth2 flow — must be public
                .requestMatchers("/oauth2/**", "/login/oauth2/**", "/login/**").permitAll()

                // H2 console — dev only
                .requestMatchers("/h2-console/**").permitAll()

                // Public read access
                .requestMatchers("/", "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()

                // Admin only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Everything else requires a valid JWT
                .anyRequest().authenticated()
            )

            // Google OAuth2 login — wired to your CustomSuccessHandler
            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(userInfo ->
                    userInfo.userService(customOAuth2CustomerService)) // saves Customer to DB ✓
                .successHandler(customSuccessHandler)                  // mints JWT ✓
            )

            // JWT filter — validates token on every request
            .addFilterBefore(jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class)

            // Allow H2 console iframe in dev
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
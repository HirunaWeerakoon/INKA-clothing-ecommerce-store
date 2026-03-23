package com.example.inka_backend.config;

import com.example.inka_backend.security.JwtAuthenticationFilter;
import com.example.inka_backend.service.CustomOAuth2CustomerService;
import jakarta.servlet.DispatcherType;
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
    private CustomSuccessHandler customSuccessHandler;

    @Autowired
    private CustomOAuth2CustomerService customOAuth2CustomerService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // H2 console — allow all dispatcher types so it works without a session
                .dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ERROR).permitAll()
                .requestMatchers("/h2-console/**").permitAll()

                // Google OAuth2 flow
                .requestMatchers("/oauth2/**", "/login/oauth2/**", "/login/**").permitAll()

                // Public read access
                .requestMatchers("/", "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                .requestMatchers("/api/images/**").permitAll() // Cloudinary image upload endpoint

                // Admin only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Everything else requires a valid JWT
                .anyRequest().authenticated()
            
            )

            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(userInfo ->
                    userInfo.userService(customOAuth2CustomerService))
                .successHandler(customSuccessHandler)
            )

            .addFilterBefore(jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class)

            // Required for H2 console to render in iframe
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
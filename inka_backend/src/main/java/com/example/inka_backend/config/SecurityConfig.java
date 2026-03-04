package com.example.inka_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Autowired
        private CustomSuccessHandler customSuccessHandler;

        @Autowired
        private com.example.inka_backend.security.JwtAuthenticationFilter jwtAuthenticationFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                // 1. Disable CSRF because we are building a REST API for React
                                .csrf(csrf -> csrf.disable())

                                // 2. Define who can access what
                                .authorizeHttpRequests(auth -> auth
                                                // Allow anyone to see products and the homepage
                                                .requestMatchers("/", "/api/products/**", "/login/**").permitAll()

                                                // ONLY Admins can access anything starting with /api/admin/
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                                                // Anything else requires a login
                                                .anyRequest().authenticated())

                                // 3. Enable Google Login
                                .oauth2Login(oauth -> oauth
                                                .successHandler(customSuccessHandler) // Connect the handler here
                                )

                                // 4. Add JWT Token filter
                                .addFilterBefore(jwtAuthenticationFilter,
                                                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}

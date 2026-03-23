package com.example.inka_backend.config;

import com.example.inka_backend.model.Customer;
import com.example.inka_backend.model.UserRole;
import com.example.inka_backend.repository.CustomerRepository;
import com.example.inka_backend.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Optional<Customer> customerOpt = customerRepository.findByEmail(email);
        Customer customer;

        if (customerOpt.isPresent()) {
            customer = customerOpt.get();
        } else {
            customer = new Customer();
            customer.setEmail(email);
            customer.setName(name);
            customer.setRole(UserRole.USER); // default role
            customer = customerRepository.save(customer);
        }

        String token = jwtTokenProvider.generateToken(customer.getCustomerId(), customer.getEmail(),
                customer.getRole());

        String targetUrl = "http://localhost:3000/oauth2/redirect?token=" + token;
        response.sendRedirect(targetUrl);
    }
}
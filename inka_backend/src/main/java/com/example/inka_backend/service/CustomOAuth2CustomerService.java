package com.example.inka_backend.service;

import com.example.inka_backend.model.Customer;
import com.example.inka_backend.repository.CustomerRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2CustomerService extends DefaultOAuth2UserService {

    private final CustomerRepository customerRepository;

    public CustomOAuth2CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // fetch the Google profile (Spring does this automatically)
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // extract fields from the Google profile
        String googleId   = oAuth2User.getAttribute("sub");    // Google's permanent unique ID
        String email      = oAuth2User.getAttribute("email");
        String name       = oAuth2User.getAttribute("name");
        String pictureUrl = oAuth2User.getAttribute("picture");

        //  find existing customer by googleId OR create a new one
        Customer customer = customerRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setGoogleId(googleId);
                    return newCustomer;
                });

        // always sync latest info from Google (name/photo can change)
        customer.setEmail(email);
        customer.setName(name);
        customer.setPictureUrl(pictureUrl);
        customerRepository.save(customer);

        //return the OAuth2User so Spring Security sets the security context
        return oAuth2User;
    }
}
package org.example.aayojan.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.aayojan.Entities.User;
import org.example.aayojan.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        if (user != null) {
            String redirectURL = "/home"; // Default page if role not recognized

            if ("STUDENT".equalsIgnoreCase(user.getRole())) {
                redirectURL = "/student/complete-profile";
            } else if ("FACULTY".equalsIgnoreCase(user.getRole())) {
                redirectURL = "/faculty/complete-profile";
            }
            else redirectURL = "/eventAuthority";


            response.sendRedirect(redirectURL);
        } else {
            response.sendRedirect("/login?error=true");
        }
    }
}

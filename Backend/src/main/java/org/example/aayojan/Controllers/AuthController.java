package org.example.aayojan.Controllers;

import org.example.aayojan.DTO.LoginRequest;
import org.example.aayojan.DTO.UserDTO;
import org.example.aayojan.Services.CustomUserDetailsService;
import org.example.aayojan.Services.UserService;
import org.example.aayojan.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());

        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            logger.warn("Login attempt with empty email");
            return ResponseEntity.badRequest().body(Map.of("error", "Email cannot be empty"));
        }

        if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            logger.warn("Login attempt with empty password");
            return ResponseEntity.badRequest().body(Map.of("error", "Password cannot be empty"));
        }

        try {
            // First check if user exists
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            logger.info("User found with role: {}", userDetails.getAuthorities());

            // Then attempt authentication
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            logger.info("Authentication successful for user: {}", loginRequest.getEmail());

            final String jwt = jwtUtil.generateToken(userDetails);
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("token", jwt);
            response.put("role", role);
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException ex) {
            logger.warn("Authentication failed for user: {} - Invalid credentials", loginRequest.getEmail());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        } catch (AuthenticationException ex) {
            logger.error("Authentication error for user: {}", loginRequest.getEmail(), ex);
            return ResponseEntity.status(401).body(Map.of("error", "Authentication failed: " + ex.getMessage()));
        } catch (Exception ex) {
            logger.error("Unexpected error during login for user: {}", loginRequest.getEmail(), ex);
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred during login"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO userDTO) {
        try {
            userService.registerUser(userDTO);
            return ResponseEntity.ok(Map.of("message", "Signup successful!"));
        } catch (RuntimeException ex) {
            logger.error("Signup error: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}

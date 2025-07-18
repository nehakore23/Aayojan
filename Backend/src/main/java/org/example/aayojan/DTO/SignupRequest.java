package org.example.aayojan.DTO;

import lombok.Data;

@Data
public class SignupRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String confirmPassword;
    private String role; // STUDENT or FACULTY
} 
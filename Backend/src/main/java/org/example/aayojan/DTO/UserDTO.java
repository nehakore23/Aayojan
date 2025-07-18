package org.example.aayojan.DTO;

import lombok.Data;

@Data
public class UserDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String confirmPassword;
    private String role;            // STUDENT or FACULTY
    private String googleId;        // Optional: used in case of Google login
    private String authProvider;    // "LOCAL" or "GOOGLE"

    public UserDTO() {}

    public UserDTO(String firstName, String lastName, String email, String password, String confirmPassword, String role, String googleId, String authProvider) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.role = role;
        this.googleId = googleId;
        this.authProvider = authProvider;
    }
}

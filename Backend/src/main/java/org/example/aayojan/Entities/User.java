package org.example.aayojan.Entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) // Changed to nullable=true to support Google auth
    private String password;

    @Column(nullable = false)
    private String role;  // STUDENT or FACULTY

    @Column(nullable = true)
    private String googleId; // To store Google's unique user ID

    @Column(nullable = true)
    private String authProvider; // "LOCAL" or "GOOGLE"

    @Column(nullable = true)
    private String profilePicUrl="null";

    public User(String firstName, String lastName, String email, String password, String role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.authProvider = "LOCAL";
    }

    // New constructor for Google authentication
    public User(String firstName, String lastName, String email, String googleId, String role , boolean isGoogle) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.googleId = googleId;
        this.role = role;
        this.authProvider = "GOOGLE";
    }

    public User() {
    }

    // Custom method to get full name
    public String getName() {
        return firstName + " " + lastName;
    }
}
package org.example.aayojan.ViewModel;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentProfileViewModel {
    // Student properties

    private String enrollmentNumber;
    private String course;
    private int semester;
    private String department;
    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;

    // User properties
    private Long id;
    private String name;  // Combined first and last name
    private String email;
    private String profilePicUrl;

    // Additional properties needed for the view
    private boolean profileComplete;
}
package org.example.aayojan.ViewModel;

import lombok.Data;

@Data
public class FacultyProfileViewModel {
    // Faculty properties
    private Long id;
    private String facultyId;
    private String name;
    private String department;
    private String designation;
    private String specialization; // Maps to expertise in Faculty entity
    private String phoneNumber;

    // User properties
    private String email;
    private String profilePicUrl;

}
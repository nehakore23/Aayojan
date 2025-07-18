package org.example.aayojan.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentDTO {
    private String name;
    private Long studentId;
    private String enrollmentNumber; // This will contain values like "23ce092"
    private String course;
    private int semester;
    private String department;
    private LocalDate dateOfBirth;  // Add this
    private String gender;         // Add this
    private String phoneNumber;    // Add this
}
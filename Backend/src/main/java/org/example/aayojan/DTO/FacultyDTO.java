package org.example.aayojan.DTO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FacultyDTO {
    private Long userId;
    private Long id;
    private String facultyCode;
    private String designation;
    private String department;
    //private String employeeId;
    //private String specialization;
    private String phoneNumber;
    private String gender;
    private LocalDate dateOfBirth;
    private String expertise;
}
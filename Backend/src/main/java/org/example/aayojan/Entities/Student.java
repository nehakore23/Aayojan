package org.example.aayojan.Entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.bind.annotation.Mapping;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId; // Let the database auto-generate this

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Reference to user table

    @Column(name = "enrollment_number", unique = true, length = 10)
    private String enrollmentNumber; // Stores values like "23ce092"

    @Column
    private String course;

    @Column
    private int semester;

    @Column
    private String department;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @ManyToMany(mappedBy = "studentCoordinators")
    private List<Event> coordinatedEvents ;
    // Custom constructor for easy instantiation
    public Student(User user, String enrollmentNumber, String course, int semester, String department) {
        this.user = user;
        this.enrollmentNumber = enrollmentNumber;
        this.course = course;
        this.semester = semester;
        this.department = department;
    }

    // Additional constructor with all fields
    public Student(User user, String enrollmentNumber, String course, int semester,
                   String department, LocalDate dateOfBirth, String gender, String phoneNumber) {
        this.user = user;
        this.enrollmentNumber = enrollmentNumber;
        this.course = course;
        this.semester = semester;
        this.department = department;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
    }
}
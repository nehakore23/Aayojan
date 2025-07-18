package org.example.aayojan.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
@Table(name = "faculty")
@NoArgsConstructor
@AllArgsConstructor
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id; //autoincrement specific for faculty table

    @Column(name = "faculty_code")
    private String facultyCode;   //every faculty's code like 1234

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToMany(mappedBy = "facultyCoordinators")
    @JsonBackReference
    private List<Event> coordinatedEvents ;

    private String designation;
    private String department;
    //private String employeeId;
    private String gender;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String  expertise;
    
}





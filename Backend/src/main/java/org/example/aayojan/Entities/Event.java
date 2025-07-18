//package org.example.aayojan.Entities;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.sql.Time;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//@Data
//@Entity
//@Table(name = "event")
//public class Event {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "event_id")
//    private int event_id;
//    private int location_id;
//    private String title;
//    private String description;
//    private Date date;
//    private int assigned_by;
//    private Time time;
//
//
//    @ManyToMany
//    @JoinTable(
//            name = "event_faculty_coordinators",
//            joinColumns = @JoinColumn(name = "event_id"),
//            inverseJoinColumns = @JoinColumn(name = "faculty_id")
//    )
//    private List<Faculty> facultie_coordinators;
//
//
//}
package org.example.aayojan.Entities;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;


import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
@Data
@Entity
@Table(name = "event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private int eventId;  // Changed to camelCase

    @Column(name = "location_id")
    private int locationId;  // Changed to camelCase

    private String location;

    @Lob // Large Object (BLOB)
    private byte[] image;  // Storing image as byte array

    private String title;
    private String description;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(name = "assigned_by")
    private int assignedBy;  // Changed to camelCase

    @Column(name = "published",columnDefinition = "integer default 0")
    private int published;
    private LocalTime time;

    @ManyToMany
    @JoinTable(
            name = "event_faculty_coordinators",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "faculty_id")
    )
    
    @JsonManagedReference
    private List<Faculty> facultyCoordinators;  // Corrected to camelCase

    @ManyToMany
    @JoinTable(
            name="event_student_coordinators"
            ,joinColumns = @JoinColumn(name="event_id")
            ,inverseJoinColumns = @JoinColumn(name="student_id")
    )
    private List<Student> studentCoordinators;
}
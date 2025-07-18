package org.example.aayojan.Controllers;

import org.example.aayojan.DTO.EventDTO;
import org.example.aayojan.DTO.StudentDTO;
import org.example.aayojan.Entities.Event;
import org.example.aayojan.Entities.Registration;
import org.example.aayojan.Entities.Student;
import org.example.aayojan.Entities.User;
import org.example.aayojan.Services.EventRegistrationService;
import org.example.aayojan.Services.StudentService;
import org.example.aayojan.ViewModel.StudentProfileViewModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student-profile")
public class StudentProfileController {

    @Autowired
    private EventRegistrationService eventRegistrationService;
    @Autowired
    private StudentService studentService;

    // Get current student's profile
    @GetMapping
    public ResponseEntity<?> getStudentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        Student student = studentService.getStudentByUserEmail(currentUserEmail);
        if (student == null || student.getUser() == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Profile not found or not created yet"));
        }

        User user = student.getUser();
        StudentProfileViewModel viewModel = new StudentProfileViewModel();
        viewModel.setId(user.getId());
        viewModel.setEnrollmentNumber(student.getEnrollmentNumber());
        viewModel.setCourse(student.getCourse());
        viewModel.setSemester(student.getSemester());
        viewModel.setDepartment(student.getDepartment());
        viewModel.setDateOfBirth(student.getDateOfBirth());
        viewModel.setGender(student.getGender());
        viewModel.setPhoneNumber(student.getPhoneNumber());
        viewModel.setName(user.getFirstName() + " " + user.getLastName());
        viewModel.setEmail(user.getEmail());
        viewModel.setProfilePicUrl(user.getProfilePicUrl());

        boolean profileComplete = studentService.isProfileComplete(user.getId());

        // Get all registrations for the student
        List<Registration> registrations = eventRegistrationService.getRegistrationsByStudent(student);
        List<Event> registeredEvents = registrations.stream()
                .map(Registration::getEvent)
                .collect(Collectors.toList());

        // Dummy stats for prototype
        int eventsAttended = registeredEvents.size();
        int achievements = 5; 
        int certificates = 3; 

        return ResponseEntity.ok(Map.of(
                "student", viewModel,
                "profileComplete", profileComplete,
                "eventsAttended", eventsAttended,
                "achievements", achievements,
                "certificates", certificates,
                "upcomingEvents", registeredEvents,
                "registrations", registrations
        ));
    }

    // Get student profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentProfileById(@PathVariable("id") Long id) {
        Student student = studentService.getStudentById(id);
        if (student == null || student.getUser() == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Student not found"));
        }
        User user = student.getUser();
        StudentProfileViewModel viewModel = new StudentProfileViewModel();
        viewModel.setId(user.getId());
        viewModel.setEnrollmentNumber(student.getEnrollmentNumber());
        viewModel.setCourse(student.getCourse());
        viewModel.setSemester(student.getSemester());
        viewModel.setDepartment(student.getDepartment());
        viewModel.setDateOfBirth(student.getDateOfBirth());
        viewModel.setGender(student.getGender());
        viewModel.setPhoneNumber(student.getPhoneNumber());
        viewModel.setName(user.getFirstName() + " " + user.getLastName());
        viewModel.setEmail(user.getEmail());
        viewModel.setProfilePicUrl(user.getProfilePicUrl());

        boolean profileComplete = studentService.isProfileComplete(user.getId());

        return ResponseEntity.ok(Map.of(
                "student", viewModel,
                "profileComplete", profileComplete
        ));
    }

    // Update student profile (with optional profile picture)
    @PostMapping("/update")
    public ResponseEntity<?> updateStudentProfile(
            @ModelAttribute StudentDTO studentDTO,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        try {
            studentService.updateStudentProfile(currentUserEmail, studentDTO, profilePicture);
            return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
package org.example.aayojan.Controllers;

import org.example.aayojan.DTO.EventDTO;
import org.example.aayojan.DTO.FacultyDTO;
import org.example.aayojan.Entities.Faculty;
import org.example.aayojan.Entities.User;
import org.example.aayojan.Services.EventService;
import org.example.aayojan.Services.FacultyService;
import org.example.aayojan.Services.UserService;
import org.example.aayojan.Services.EmailService;
import org.example.aayojan.ViewModel.FacultyProfileViewModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/faculty-profile")
public class FacultyProfileController {

    @Autowired
    private FacultyService facultyService;

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    // Get current faculty profile and stats
    @GetMapping
    public ResponseEntity<?> getFacultyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();

        Faculty faculty = facultyService.getFacultyByUserEmail(currentUserEmail);
        if (faculty == null || faculty.getUser() == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Profile not found or not created yet"));
        }

        User user = faculty.getUser();
        FacultyProfileViewModel viewModel = createViewModel(faculty, user);

        List<EventDTO> allEvents = eventService.getAllEvents();
        String facultyFullName = user.getFirstName() + " " + user.getLastName();
        List<EventDTO> facultyEvents = allEvents.stream()
                .filter(event -> event.getFacultyCoordinators() != null &&
                        event.getFacultyCoordinators().contains(facultyFullName))
                .collect(Collectors.toList());

        LocalDate currentDate = LocalDate.now();
        List<EventDTO> upcomingEvents = facultyEvents.stream()
                .filter(event -> event.getDate() != null && event.getDate().isAfter(currentDate))
                .collect(Collectors.toList());
        List<EventDTO> pastEvents = facultyEvents.stream()
                .filter(event -> event.getDate() != null && event.getDate().isBefore(currentDate))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("faculty", viewModel);
        response.put("upcomingEvents", upcomingEvents);
        response.put("pastEvents", pastEvents);
        response.put("eventsOrganized", facultyEvents.size());
        response.put("studentsParticipated", calculateTotalStudentParticipants(facultyEvents));
        response.put("certificates", calculateTotalCertificates(pastEvents));

        return ResponseEntity.ok(response);
    }

    // Get faculty profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFacultyProfileById(@PathVariable("id") Long id) {
        Faculty faculty = facultyService.getFacultyById(id);
        if (faculty == null || faculty.getUser() == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Faculty not found"));
        }

        FacultyProfileViewModel viewModel = createViewModel(faculty, faculty.getUser());

        List<EventDTO> allEvents = eventService.getAllEvents();
        String facultyFullName = faculty.getUser().getFirstName() + " " + faculty.getUser().getLastName();
        List<EventDTO> facultyEvents = allEvents.stream()
                .filter(event -> event.getFacultyCoordinators() != null &&
                        event.getFacultyCoordinators().contains(facultyFullName))
                .collect(Collectors.toList());

        LocalDate currentDate = LocalDate.now();
        List<EventDTO> upcomingEvents = facultyEvents.stream()
                .filter(event -> event.getDate() != null && event.getDate().isAfter(currentDate))
                .collect(Collectors.toList());
        List<EventDTO> pastEvents = facultyEvents.stream()
                .filter(event -> event.getDate() != null && event.getDate().isBefore(currentDate))
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("faculty", viewModel);
        response.put("upcomingEvents", upcomingEvents);
        response.put("pastEvents", pastEvents);
        response.put("eventsOrganized", facultyEvents.size());
        response.put("studentsParticipated", calculateTotalStudentParticipants(facultyEvents));
        response.put("certificates", calculateTotalCertificates(pastEvents));

        return ResponseEntity.ok(response);
    }

    // Update faculty profile (with optional profile picture)
    @PostMapping("/update")
    public ResponseEntity<?> updateFacultyProfile(
            @ModelAttribute FacultyProfileViewModel facultyViewModel,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            User user = userService.getUserByEmail(currentUserEmail);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            Faculty faculty = facultyService.getFacultyByUserEmail(currentUserEmail);
            boolean isNewFaculty = faculty == null;
            
            if (isNewFaculty) {
                // Create new faculty record if it doesn't exist
                faculty = new Faculty();
                faculty.setUser(user);
                faculty.setFacultyCode(facultyViewModel.getFacultyId());
            }

            // Update user information
            String fullName = facultyViewModel.getName();
            if (fullName == null || fullName.trim().isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("error", "Name cannot be empty"));
            }
            String[] nameParts = fullName.split(" ", 2);
            user.setFirstName(nameParts[0]);
            user.setLastName(nameParts.length > 1 ? nameParts[1] : "");

            // Update faculty information
            faculty.setDepartment(facultyViewModel.getDepartment());
            faculty.setDesignation(facultyViewModel.getDesignation());
            faculty.setExpertise(facultyViewModel.getSpecialization());
            faculty.setPhoneNumber(facultyViewModel.getPhoneNumber());
            faculty.setFacultyCode(facultyViewModel.getFacultyId());

            // Handle profile picture upload if provided
            if (profilePicture != null && !profilePicture.isEmpty()) {
                String fileName = user.getId() + "_" + profilePicture.getOriginalFilename();
                String uploadDir = "src/main/resources/static/uploads/profile-pictures/";

                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                Path path = Paths.get(uploadDir + fileName);
                Files.copy(profilePicture.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                user.setProfilePicUrl("/uploads/profile-pictures/" + fileName);
            }

            userService.updateUser(user);
            
            // Use saveFaculty for new records, updateFaculty for existing ones
            if (isNewFaculty) {
                FacultyDTO facultyDTO = new FacultyDTO();
                facultyDTO.setUserId(user.getId());
                facultyDTO.setFacultyCode(faculty.getFacultyCode());
                facultyDTO.setDepartment(faculty.getDepartment());
                facultyDTO.setDesignation(faculty.getDesignation());
                facultyDTO.setExpertise(faculty.getExpertise());
                facultyDTO.setPhoneNumber(faculty.getPhoneNumber());
                facultyService.saveFaculty(facultyDTO);

                // Send notification email to Event Authority
                String eventAuthorityEmail = "eventauthority@aayojan.com"; // Replace with actual Event Authority email
                String facultyName = user.getFirstName() + " " + user.getLastName();
                emailService.sendFacultyProfileNotification(eventAuthorityEmail, facultyName, faculty.getFacultyCode());
            } else {
                facultyService.updateFaculty(faculty);
            }

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Helper methods
    private FacultyProfileViewModel createViewModel(Faculty faculty, User user) {
        FacultyProfileViewModel viewModel = new FacultyProfileViewModel();
        viewModel.setId(faculty.getId());
        viewModel.setFacultyId(faculty.getFacultyCode());
        viewModel.setName(user.getFirstName() + " " + user.getLastName());
        viewModel.setDepartment(faculty.getDepartment());
        viewModel.setDesignation(faculty.getDesignation());
        viewModel.setSpecialization(faculty.getExpertise());
        viewModel.setPhoneNumber(faculty.getPhoneNumber());
        viewModel.setEmail(user.getEmail());
        viewModel.setProfilePicUrl(user.getProfilePicUrl());
        return viewModel;
    }

    private int calculateTotalStudentParticipants(List<EventDTO> events) {
        return events.size() * 15; // Placeholder
    }

    private int calculateTotalCertificates(List<EventDTO> pastEvents) {
        return pastEvents.size() * 12; // Placeholder
    }
}
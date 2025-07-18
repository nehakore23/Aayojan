package org.example.aayojan.Controllers;

import org.example.aayojan.DTO.EventDTO;
import org.example.aayojan.Entities.User;
import org.example.aayojan.Services.EventService;
import org.example.aayojan.Services.FacultyService;
import org.example.aayojan.Services.StudentService;
import org.example.aayojan.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    private final EventService eventService;
    private final FacultyService facultyService;
    private final UserService userService;
    private final StudentService studentService;

    @Autowired
    public HomeController(EventService eventService, FacultyService facultyService, UserService userService, StudentService studentService) {
        this.eventService = eventService;
        this.facultyService = facultyService;
        this.userService = userService;
        this.studentService = studentService;
    }

    // 1. Get all published events
    @GetMapping("/events/published")
    public ResponseEntity<List<EventDTO>> getPublishedEvents() {
        List<EventDTO> events = eventService.getPublishedEvents();
        return ResponseEntity.ok(events);
    }

    // 2. Get current user info and profile completion status
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        Object principal = authentication.getPrincipal();
        String email = null;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        }
        if (email == null) {
            return ResponseEntity.status(401).body("No user email found");
        }
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        Map<String, Object> result = new HashMap<>();
        result.put("userRole", user.getRole());
        result.put("profileLink", user.getRole().equalsIgnoreCase("STUDENT") ? "/student/complete-profile"
                : user.getRole().equalsIgnoreCase("FACULTY") ? "/faculty/complete-profile" : "/home");
        result.put("studentProfileIncomplete",
                ("STUDENT".equalsIgnoreCase(user.getRole()) || "ROLE_STUDENT".equalsIgnoreCase(user.getRole()))
                        && !studentService.isProfileComplete(user.getId()));
        result.put("facultyProfileIncomplete",
                ("FACULTY".equalsIgnoreCase(user.getRole()) || "ROLE_FACULTY".equalsIgnoreCase(user.getRole()))
                        && !facultyService.isProfileComplete(user.getId()));
        return ResponseEntity.ok(result);
    }

    // 3. Get current user's coordinated events
    @GetMapping("/myEvents")
    public ResponseEntity<?> getMyEvents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        UserDetails currentUser = (UserDetails) authentication.getPrincipal();
        String email = currentUser.getUsername();
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<EventDTO> events;
        if ("FACULTY".equalsIgnoreCase(user.getRole()) || "ROLE_FACULTY".equalsIgnoreCase(user.getRole())) {
            events = facultyService.getCoordinatedEvents(email);
        } else if ("STUDENT".equalsIgnoreCase(user.getRole()) || "ROLE_STUDENT".equalsIgnoreCase(user.getRole())) {
            events = studentService.getCoordinatedEvents(email);
        } else {
            events = Collections.emptyList();
        }
        Map<String, Object> result = new HashMap<>();
        result.put("events", events);
        result.put("userRole", user.getRole());
        return ResponseEntity.ok(result);
    }

    // 4. Get event details by ID
    @GetMapping("/event/{id}")
    public ResponseEntity<?> getEvent(@PathVariable int id) {
        EventDTO event = eventService.getEventDTOById(id);
        if (event == null) {
            return ResponseEntity.status(404).body("Event not found");
        }
        // Optionally add user role if needed
        return ResponseEntity.ok(event);
    }
}
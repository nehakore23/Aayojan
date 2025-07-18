package org.example.aayojan.Controllers;

import com.google.zxing.WriterException;
import org.example.aayojan.Entities.Registration;
import org.example.aayojan.Services.EventRegistrationService;
import org.example.aayojan.Services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventRegistrationController {

    @Autowired
    private EventRegistrationService eventRegistrationService;
    @Autowired
    private StudentService studentService;

    // Register for an event (expects JSON: { "eventId": 123 })
    @PostMapping("/register")
    public ResponseEntity<?> registerForEvent(@RequestBody Map<String, Object> body) {
        Integer eventId = (Integer) body.get("eventId");
        if (eventId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Event ID is required"));
        }

        Long studentId = getStudentIdFromPrincipal();
        if (studentId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Student not authenticated"));
        }

        try {
            Registration registration = eventRegistrationService.registerStudentForEvent(eventId, studentId);
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "registration", registration
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Download ticket as PDF
    @GetMapping("/ticket/{registrationId}")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable Long registrationId)
            throws IOException, WriterException {
        byte[] pdfBytes = eventRegistrationService.generateTicketPdf(registrationId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ticket.pdf");
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    // REST endpoint for marking attendance
    @PostMapping("/attendance/{ticketId}")
    public ResponseEntity<?> markAttendance(@PathVariable String ticketId) {
        try {
            eventRegistrationService.markAttendance(ticketId);
            return ResponseEntity.ok(Map.of("message", "Attendance marked successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Helper method to get student ID from authenticated user
    private Long getStudentIdFromPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            return null;
        }
        User currentUser = (User) authentication.getPrincipal();
        return studentService.getStudentIdFromUserEmail(currentUser.getUsername());
    }
}
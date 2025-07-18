package org.example.aayojan.Controllers;

import jakarta.validation.Valid;
import org.example.aayojan.DTO.EventDTO;
import org.example.aayojan.DTO.GenerateEventDto;
import org.example.aayojan.Services.FacultyService;
import org.example.aayojan.Services.EventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/eventAuthority")
public class EventAuthorityController {

    private static final Logger logger = LoggerFactory.getLogger(EventAuthorityController.class);

    @Autowired
    FacultyService facultyService;

    @Autowired
    private EventService eventService;

    // Get all faculty options
    @GetMapping("/faculty")
    public ResponseEntity<List<?>> getAllFaculty() {
        return ResponseEntity.ok(facultyService.getAllFaculty());
    }

    // Create event
    @PostMapping("/event")
    public ResponseEntity<?> createEvent(@Valid @RequestBody GenerateEventDto generateEventDto) {
        if (generateEventDto.getEventDate() != null &&
                generateEventDto.getEventDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Event date cannot be in the past");
        }
        try {
            eventService.generateEvent(generateEventDto);
            return ResponseEntity.ok("Event created successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid event data: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create event. Please try again.");
        }
    }

    // Get all events
    @GetMapping("/events")
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        try {
            List<EventDTO> events = eventService.getAllEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete event
   @DeleteMapping("/event/delete/{id}")
public ResponseEntity<?> deleteEvent(@PathVariable int id) {
    System.out.println("Delete request received for event id: " + id);
    try {
        eventService.deleteEvent(id);
        System.out.println("Event deleted successfully for id: " + id);
        return ResponseEntity.ok("Event deleted successfully");
    } catch (NoSuchElementException e) {
        System.out.println("Event not found for id: " + id);
        return ResponseEntity.status(404).body("Event not found with ID: " + id);
    } catch (Exception e) {
        System.out.println("Error deleting event for id: " + id + " Error: " + e.getMessage());
        return ResponseEntity.internalServerError().body("Failed to delete event. Please try again.");
    }
}


    // Get event by id for editing
    @GetMapping("/event/{id}")
    public ResponseEntity<?> getEvent(@PathVariable int id) {
        try {
            GenerateEventDto eventDto = eventService.getGenerateEventDTOById(id);
            if (eventDto == null) {
                return ResponseEntity.status(404).body("Event not found.");
            }
            return ResponseEntity.ok(eventDto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to load event for editing.");
        }
    }

    // Update event
    @PutMapping("/event/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable int id, @Valid @RequestBody GenerateEventDto generateEventDto) {
        if (generateEventDto.getEventDate() != null &&
                generateEventDto.getEventDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Event date cannot be in the past");
        }
        try {
            eventService.updateEvent(id, generateEventDto);
            return ResponseEntity.ok("Event updated successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body("Event not found.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to update event.");
        }
    }

    // Toggle publish status
    @PutMapping("/event/togglePublish/{id}")
    public ResponseEntity<?> togglePublishStatus(@PathVariable int id) {
        try {
            eventService.togglePublishStatus(id);
            return ResponseEntity.ok("Event publish status updated successfully.");
        } catch (Exception e) {
            logger.error("Error toggling publish status for event id: {}", id, e);
            return ResponseEntity.internalServerError().body("Failed to update event publish status: " + e.getMessage());
        }
    }
}
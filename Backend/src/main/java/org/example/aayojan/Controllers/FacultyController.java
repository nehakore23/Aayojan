package org.example.aayojan.Controllers;

import org.example.aayojan.DTO.EventDTO;
import org.example.aayojan.Services.EventService;
import org.example.aayojan.Services.FacultyService;
import org.example.aayojan.Services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;





import java.io.IOException;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


@RestController
@RequestMapping("/api/faculty")
public class FacultyController {
    private final EventService eventService;
    private final StudentService studentService;
    private final FacultyService facultyService;

    
    @Autowired
    public FacultyController(EventService eventService, StudentService studentService, FacultyService facultyService) {
        this.eventService = eventService;
        this.studentService = studentService;
        this.facultyService = facultyService;
    }
        
         

    // Get complete event details
    @GetMapping("/completeEventDetails/{eventId}")
    public ResponseEntity<EventDTO> getCompleteEventDetails(@PathVariable int eventId) {
        EventDTO eventDTO = eventService.getEventDTOById(eventId);
        if (eventDTO == null) {
            return ResponseEntity.notFound().build();
        }
        eventDTO.setAllStudentIds(studentService.getAllStudentIds());
        return ResponseEntity.ok(eventDTO);
    }

    // Save complete event details
    @PostMapping("/completeEventDetails/save/{eventId}")
    public ResponseEntity<?> saveCompleteEvent(@RequestBody EventDTO eventDTO, @PathVariable int eventId) {
        try {
            eventService.completeEventDetails(eventDTO);
            return ResponseEntity.ok("Event details saved successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving event details");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

//     @PostMapping("/completeEventDetails/save/{eventId}")
// public ResponseEntity<?> saveCompleteEvent(
//     @PathVariable int eventId,
//     @RequestParam("title") String title,
//     @RequestParam("location") String location,
//     @RequestParam("date") String date,
//     @RequestParam("time") String time,
//     @RequestParam("description") String description,
//     @RequestParam("stdCoordinatorsCount") int count,
//     @RequestParam("studentCoordinators[0]") String sc1,
//     @RequestParam(value = "studentCoordinators[1]", required = false) String sc2,
//     @RequestParam(value = "studentCoordinators[2]", required = false) String sc3,
//     @RequestParam(value = "studentCoordinators[3]", required = false) String sc4,
//     @RequestParam("thumbnail") MultipartFile thumbnail
// ) {
//     // Save to DB
//     return ResponseEntity.ok("Saved");
// }


    // Get event thumbnail as image
    @GetMapping(value = "/event-thumbnail/{eventId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getEventThumbnail(@PathVariable int eventId) {
        byte[] imageBytes = eventService.getEventThumbnailBytes(eventId);
        if (imageBytes != null && imageBytes.length > 0) {
            return ResponseEntity.ok(imageBytes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Toggle event publish status
    @PostMapping("/events/toggle-publish/{id}")
    public ResponseEntity<?> togglePublishStatus(@PathVariable("id") int eventId) {
        try {
            eventService.togglePublishStatus(eventId);
            return ResponseEntity.ok("Event publication status updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update publication status: " + e.getMessage());
        }
    }

}


        
       


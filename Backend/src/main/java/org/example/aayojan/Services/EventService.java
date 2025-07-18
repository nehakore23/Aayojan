package org.example.aayojan.Services;

import org.example.aayojan.DTO.EventDTO;
import org.example.aayojan.DTO.GenerateEventDto;
import org.example.aayojan.Entities.Event;
import org.example.aayojan.Entities.Faculty;
import org.example.aayojan.Entities.Student;
import org.example.aayojan.Repositories.FacultyRepo;
import org.example.aayojan.Repositories.EventRepo;
import org.example.aayojan.Repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    FacultyRepo facultyRepo;
    @Autowired
    EventRepo EventRepo;
    @Autowired
    private EventRepo eventRepo;
    @Autowired
    private FacultyService facultyService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private StudentRepository studentRepository;


   public void generateEvent(GenerateEventDto generateEventDto) {
    Event event = new Event();
    event.setTitle(generateEventDto.getEventName());
    event.setDate(generateEventDto.getEventDate());

    // Set default or empty values for required fields
    event.setPublished(0); // 0 = not published, 1 = published
    event.setDescription(""); // or use a value from DTO if available
    event.setLocation("");    // or use a value from DTO if available
    event.setTime(null);      // or set a default time if needed

    // Fetch Faculty entities by their IDs
    if (generateEventDto.getAssignedFacultyIds() != null && !generateEventDto.getAssignedFacultyIds().isEmpty()) {
        List<Faculty> facultyList = facultyRepo.findAllById(generateEventDto.getAssignedFacultyIds());
        event.setFacultyCoordinators(facultyList);
    } else {
        event.setFacultyCoordinators(new ArrayList<>());
    }

    eventRepo.save(event);
}

    public List<EventDTO> getAllEvents()
    {
        List<Event> events = eventRepo.findAll();
        return events.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

    }
    public List<EventDTO> getPublishedEvents() {
        List<Event> publishedEvents = eventRepo.findByPublished(1);
        return publishedEvents.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }



    public EventDTO convertToDto(Event event) {
        EventDTO dto = new EventDTO();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setTime(event.getTime());
        dto.setPublished(event.getPublished());

        // Set image URL for display
        if (event.getImage() != null && event.getImage().length > 0) {
            dto.setImageUrl("/faculty/event-thumbnail/" + event.getEventId());
        } else {
            // Provide a placeholder image URL
            dto.setImageUrl("/images/placeholder-event.jpg"); // Make sure this exists in your static resources
        }

        // Format date
        if (event.getDate() != null) {
            dto.setDate(event.getDate());
            dto.setDay(event.getDate().getDayOfMonth());
            dto.setMonth(getMonthName(event.getDate().getMonthValue()));
        }

        // Get faculty names
        dto.setFacultyCoordinators(getAssignedFacultyNames(event.getFacultyCoordinators()));

        return dto;
    }

    public List<String> getAssignedFacultyNames(List<Faculty> facultyList)
    {
        ArrayList<String> assignedFacultyNames = new ArrayList<>();
        for (Faculty faculty : facultyList) {
            assignedFacultyNames.add(facultyService.getFacultyName(faculty));
        }
        return assignedFacultyNames;
    }

    public void deleteEvent(int id) {
        eventRepo.deleteById(id);
    }


    public void updateEvent(int id, GenerateEventDto generateEventDto) {
        Event event = eventRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id)); // Added orElseThrow
        event.setTitle(generateEventDto.getEventName());
        
        // Fetch Faculty entities by their IDs for update
        if (generateEventDto.getAssignedFacultyIds() != null && !generateEventDto.getAssignedFacultyIds().isEmpty()) {
            List<Faculty> facultyList = facultyRepo.findAllById(generateEventDto.getAssignedFacultyIds());
            event.setFacultyCoordinators(facultyList);
            } else {
            event.setFacultyCoordinators(new ArrayList<>()); // Clear coordinators if list is empty or null
        }
        
        event.setDate(generateEventDto.getEventDate());
        eventRepo.save(event);
    }

    public GenerateEventDto getGenerateEventDTOById(int id) {
        Event event = eventRepo.findById(id)
                               .orElseThrow(() -> new RuntimeException("Event not found with id: " + id)); // Added orElseThrow

        GenerateEventDto generateEventDto = new GenerateEventDto();
        generateEventDto.setId(event.getEventId());
        generateEventDto.setEventName(event.getTitle());
        
        // Populate assignedFacultyIds from the event's facultyCoordinators
        if (event.getFacultyCoordinators() != null) {
            List<Long> facultyIds = event.getFacultyCoordinators().stream()
                                         .map(Faculty::getId)
                                         .collect(Collectors.toList());
            generateEventDto.setAssignedFacultyIds(facultyIds);
        } else {
            generateEventDto.setAssignedFacultyIds(new ArrayList<>());
        }
        
        // The allfacultyNames field in DTO is for populating all available options in a dropdown.
        // This should be populated by the controller before rendering the form.
        // generateEventDto.setAllfacultyNames(facultyService.allFacultyNames()); // Controller should handle this

        generateEventDto.setNoOfFaculty(event.getFacultyCoordinators() != null ? event.getFacultyCoordinators().size() : 0);
        generateEventDto.setEventDate(event.getDate());
        return generateEventDto;
    }
    private String getMonthName(int month) {
        String[] months = {
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        };
        return (month >= 1 && month <= 12) ? months[month - 1] : null;
    }



    public EventDTO getEventDTOById(int id) {
        Event event = eventRepo.findById(id).get();
        System.out.println(id);
        return convertToDto(event);
    }


    public void completeEventDetails(EventDTO eventDTO) throws IOException {
        Event event = eventRepo.findById(eventDTO.getEventId()).get();
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setLocation(eventDTO.getLocation());
        event.setDate(eventDTO.getDate());
        event.setTime(eventDTO.getTime());

       // event.setImage(eventDTO.getThumbnail().getBytes());
        List<Student> studentList = new ArrayList<>();
        for(String student_id:eventDTO.getStudentCoordinators())
        {
            studentList.add(studentRepository.findByEnrollmentNumber(student_id));
        }
        event.setStudentCoordinators(studentList);

        eventRepo.save(event);


    }
    public byte[] getEventThumbnailBytes(int eventId) {
        Event event = eventRepo.findById(eventId).orElse(null);
        return event != null ? event.getImage() : null;
    }


        @Transactional
        public void togglePublishStatus(int eventId) {
            Event event = eventRepo.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

            // Toggle the published status (0 -> 1, 1 -> 0)
            event.setPublished(event.getPublished() == 1 ? 0 : 1);

            eventRepo.save(event);
        }

public List<EventDTO> getEventsByFacultyUserId(Long userId) {
    Faculty faculty = facultyRepo.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Faculty not found for userId: " + userId));

    List<Event> events = facultyRepo.findCoordinatedEventsByFacultyId(faculty.getId());

    return events.stream()
                 .map(this::convertToDto)
                 .collect(Collectors.toList());
}

}

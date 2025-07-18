package org.example.aayojan.Services;

import org.example.aayojan.DTO.EventDTO;
import org.example.aayojan.DTO.FacultyDTO;
import org.example.aayojan.Entities.Event;
import org.example.aayojan.Entities.Faculty;
import org.example.aayojan.Entities.User;
import org.example.aayojan.Repositories.FacultyRepo;
import org.example.aayojan.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {
    private static final Logger logger = LoggerFactory.getLogger(FacultyService.class);

    @Lazy
    @Autowired
    private EventService eventService;

    @Autowired
    private FacultyRepo facultyRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public List<String> allFacultyNames() {
        List<Faculty> facultyList = facultyRepository.findAll();
        List<String> facultyNames = new ArrayList<>();
        if (facultyList.isEmpty()) {
            logger.warn("No faculty members found in the database.");
        }
        for (Faculty faculty : facultyList) {
            if (faculty.getUser() != null && faculty.getUser().getFirstName() != null && faculty.getUser().getLastName() != null) {
            facultyNames.add(faculty.getUser().getFirstName() + " " + faculty.getUser().getLastName());
            } else {
                logger.warn("Faculty found with missing user details: ID {}", faculty.getId());
            }
        }
        logger.info("Returning faculty names: {}", facultyNames);
        return facultyNames;
    }

    public String getFacultyName(Faculty faculty) {
        return faculty.getUser().getFirstName() + " " + faculty.getUser().getLastName();
    }

    public Faculty getFacultyByUserId(Long userId) {
        if (userId == null) {
            logger.warn("Attempted to find faculty with null userId");
            return null;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            logger.warn("No user found with ID: {}", userId);
            return null;
        }

        return facultyRepository.findByUser(user).orElse(null);
    }

    public void saveFacultyProfile(FacultyDTO facultyDTO) {
        saveFaculty(facultyDTO);
    }

    public Faculty getFacultyByUserEmail(String email) {
        if (email == null || email.isEmpty()) {
            logger.warn("Attempted to find faculty with null or empty email");
            return null;
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            logger.warn("No user found with email: {}", email);
            return null;
        }

        return facultyRepository.findByUser(user).orElse(null);
    }

    public boolean isProfileComplete(Long userId) {
        Faculty faculty = getFacultyByUserId(userId);
        return faculty != null &&
                faculty.getDepartment() != null &&
                faculty.getDesignation() != null &&
                //faculty.getEmployeeId() != null &&
                faculty.getPhoneNumber() != null &&
                faculty.getGender() != null &&
                faculty.getDateOfBirth() != null &&
                faculty.getExpertise() != null;
    }

    public Faculty getFacultyById(Long facultyId) {
        if (facultyId == null) {
            logger.warn("Attempted to find faculty with null ID");
            return null;
        }

        return facultyRepository.findById(facultyId).orElse(null);
    }

    public void saveFaculty(FacultyDTO facultyDTO) {
        logger.debug("Saving faculty with DTO: {}", facultyDTO);

        if (facultyDTO == null) {
            throw new IllegalArgumentException("FacultyDTO cannot be null");
        }

        if (facultyDTO.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        User user = userRepository.findById(facultyDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + facultyDTO.getUserId()));

        // Find existing faculty or create new one
        Faculty faculty = facultyRepository.findByUser(user).orElse(new Faculty());

        // Set user relation
        faculty.setUser(user);

        // Update all fields from DTO
        faculty.setFacultyCode(facultyDTO.getFacultyCode());
        faculty.setDesignation(facultyDTO.getDesignation());
        faculty.setDepartment(facultyDTO.getDepartment());
        //faculty.setEmployeeId(facultyDTO.getEmployeeId());
        faculty.setPhoneNumber(facultyDTO.getPhoneNumber());
        faculty.setGender(facultyDTO.getGender());
        faculty.setDateOfBirth(facultyDTO.getDateOfBirth());
        faculty.setExpertise(facultyDTO.getExpertise());
        logger.debug("Saving faculty entity: {}", faculty);
        Faculty savedFaculty = facultyRepository.save(faculty);
        logger.debug("Saved faculty with ID: {}", savedFaculty.getId());
    }

    public List<EventDTO> getCoordinatedEvents(String email) {
        List<EventDTO> eventsDtoList = new ArrayList<>();

        List<Event> events=facultyRepository.findCoordinatedEventsByFacultyId(
                getFacultyIdFromUserEmail(email)
        );
        for (Event event : events) {
            eventsDtoList.add(eventService.convertToDto(event));
        }
        return eventsDtoList;
    }

    public Long getFacultyIdFromUserEmail(String email) {
        // First get the User
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByEmail(email));
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Then find the Faculty record associated with this User ID
            Optional<Faculty> facultyOptional = facultyRepository.findByUserId(user.getId());
            if (facultyOptional.isPresent()) {
                return facultyOptional.get().getId();
            }
        }
        return null; // If no faculty record found
    }

    // Method to update an existing faculty entity - needed by FacultyProfileController
    public void updateFaculty(Faculty faculty) {
        if (faculty == null) {
            logger.warn("Attempted to update null faculty");
            throw new IllegalArgumentException("Faculty cannot be null");
        }

        if (faculty.getId() == null) {
            logger.warn("Attempted to update faculty with null ID");
            throw new IllegalArgumentException("Faculty ID cannot be null for update operation");
        }

        logger.debug("Updating faculty with ID: {}", faculty.getId());
        Faculty savedFaculty = facultyRepository.save(faculty);
        logger.debug("Updated faculty successfully, ID: {}", savedFaculty.getId());
    }


}
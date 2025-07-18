package org.example.aayojan.Services;

import jakarta.persistence.EntityNotFoundException;
import org.example.aayojan.DTO.EventDTO;
import org.example.aayojan.DTO.StudentDTO;
import org.example.aayojan.Entities.Event;
import org.example.aayojan.Entities.Faculty;
import org.example.aayojan.Entities.Student;
import org.example.aayojan.Entities.User;
import org.example.aayojan.Repositories.StudentRepository;
import org.example.aayojan.Repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StudentService {
    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);
    @Autowired
            @Lazy
    EventService eventService;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<String> allStudentNames() {
        List<Student> studentList = studentRepository.findAll();
        List<String> studentNames = new ArrayList<>();
        for (Student student : studentList) {
            studentNames.add(student.getUser().getFirstName() + " " + student.getUser().getLastName());
        }
        return studentNames;
    }

    public String getStudentName(Student student) {
        return student.getUser().getFirstName() + " " + student.getUser().getLastName();
    }

    public Student getStudentByUserId(Long userId) {
        if (userId == null) {
            logger.warn("Attempted to find student with null userId");
            return null;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            logger.warn("No user found with ID: {}", userId);
            return null;
        }

        return studentRepository.findByUser(user).orElse(null);
    }

    public void saveStudentProfile(StudentDTO studentDTO) {
        saveStudent(studentDTO);
    }

    public Student getStudentByUserEmail(String email) {
        if (email == null || email.isEmpty()) {
            logger.warn("Attempted to find student with null or empty email");
            return null;
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            logger.warn("No user found with email: {}", email);
            return null;
        }

        return studentRepository.findByUser(user).orElse(null);
    }

    public boolean isProfileComplete(Long userId) {
        Student student = getStudentByUserId(userId);
        return student != null &&
                student.getDepartment() != null &&
                student.getCourse() != null &&
                student.getEnrollmentNumber() != null &&
                student.getSemester() > 0 &&
                student.getDateOfBirth() != null &&
                student.getGender() != null &&
                student.getPhoneNumber() != null;
    }

    public Student getStudentById(Long studentId) {
        if (studentId == null) {
            logger.warn("Attempted to find student with null ID");
            return null;
        }

        return studentRepository.findById(studentId).orElse(null);
    }

    @Transactional
    public void saveStudent(StudentDTO studentDTO) {
        // Find the corresponding user
        User user = userRepository.findById(studentDTO.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + studentDTO.getStudentId()));

        // Look for existing student by user reference
        Student student = studentRepository.findByUser(user).orElse(null);

        if (student != null) {
            // Update existing student
            student.setEnrollmentNumber(studentDTO.getEnrollmentNumber());
            student.setCourse(studentDTO.getCourse());
            student.setSemester(studentDTO.getSemester());
            student.setDepartment(studentDTO.getDepartment());
            // Set new fields
            student.setDateOfBirth(studentDTO.getDateOfBirth());
            student.setGender(studentDTO.getGender());
            student.setPhoneNumber(studentDTO.getPhoneNumber());
        } else {
            // Create new student
            student = new Student();
            student.setUser(user);
            student.setEnrollmentNumber(studentDTO.getEnrollmentNumber());
            student.setCourse(studentDTO.getCourse());
            student.setSemester(studentDTO.getSemester());
            student.setDepartment(studentDTO.getDepartment());
            // Set new fields
            student.setDateOfBirth(studentDTO.getDateOfBirth());
            student.setGender(studentDTO.getGender());
            student.setPhoneNumber(studentDTO.getPhoneNumber());
        }

        // Save the student
        studentRepository.save(student);

        logger.debug("Student saved/updated: {}", student);
    }

    public List<String> getAllStudentIds() {
        List<Student> students = studentRepository.findAll();
        List<String> studentIds = new ArrayList<>();

        for (Student student : students) {
            studentIds.add(student.getEnrollmentNumber()); // Assuming enrollmentNumber is the student ID
        }

        return studentIds;
    }

    public Long getStudentIdFromUserEmail(String email) {
        logger.debug("Attempting to get Student ID for email: {}", email);
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByEmail(email));
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            logger.debug("Found User with ID: {} for email: {}", user.getId(), email);

            // Then find the Student record associated with this User ID
            Optional<Student> studentOptional = studentRepository.findByUser_Id(user.getId());
            if (studentOptional.isPresent()) {
                Student student = studentOptional.get();
                logger.debug("Found Student with ID: {} linked to User ID: {}", student.getStudentId(), user.getId());
                return student.getStudentId();
            } else {
                logger.warn("No Student record found for User ID: {}", user.getId());
                return null;
            }
        } else {
            logger.warn("No User record found for email: {}", email);
            return null;
        }
    }

    public List<EventDTO> getCoordinatedEvents(String email) {
        List<EventDTO> eventsDtoList = new ArrayList<>();

        List<Event> events=studentRepository.findCoordinatedEventsByStudentId(
                getStudentIdFromUserEmail(email)
        );
        for (Event event : events) {
            eventsDtoList.add(eventService.convertToDto(event));
        }
        return eventsDtoList;
    }

    public void updateStudentProfile(String email, StudentDTO studentDTO, MultipartFile profilePicture) {
        // Get student by email
        Student student = getStudentByUserEmail(email);
        User user = student.getUser();

        if (student == null || user == null) {
            throw new RuntimeException("Student profile not found");
        }

        // Update user information
        String fullName = studentDTO.getName();
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        String[] nameParts = fullName.split(" ", 2);
        user.setFirstName(nameParts[0]);
        user.setLastName(nameParts.length > 1 ? nameParts[1] : "");

        // Update student information
        student.setCourse(studentDTO.getCourse());
        student.setDepartment(studentDTO.getDepartment());
        student.setSemester(studentDTO.getSemester());
        student.setPhoneNumber(studentDTO.getPhoneNumber());
        student.setGender(studentDTO.getGender());
        student.setDateOfBirth(studentDTO.getDateOfBirth());

        // Handle profile picture upload if provided
        if (profilePicture != null && !profilePicture.isEmpty()) {
            String profilePicUrl = uploadProfilePicture(profilePicture, user.getId());
            user.setProfilePicUrl(profilePicUrl);
        }

        // Save updates
        userRepository.save(user);
        studentRepository.save(student);
    }

    private String uploadProfilePicture(MultipartFile file, Long userId) {
        // Implement file upload logic
        // This could save to a local directory or cloud storage
        try {
            String fileName = userId + "_" + file.getOriginalFilename();
            String uploadDir = "uploads/profile-pictures/";

            // Ensure directory exists
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save the file
            Path path = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Return the relative URL to the file
            return "/uploads/profile-pictures/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile picture", e);
        }
    }
}
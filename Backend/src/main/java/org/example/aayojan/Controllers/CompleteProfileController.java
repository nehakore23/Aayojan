package org.example.aayojan.Controllers;

import org.example.aayojan.DTO.FacultyDTO;
import org.example.aayojan.DTO.StudentDTO;
import org.example.aayojan.Entities.Faculty;
import org.example.aayojan.Entities.Student;
import org.example.aayojan.Entities.User;
import org.example.aayojan.Services.EmailParserService;
import org.example.aayojan.Services.FacultyService;
import org.example.aayojan.Services.StudentService;
import org.example.aayojan.Services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CompleteProfileController {

    private static final Logger logger = LoggerFactory.getLogger(CompleteProfileController.class);

    private final StudentService studentService;
    private final FacultyService facultyService;
    private final UserService userService;
    private final EmailParserService emailParserService;

    public CompleteProfileController(StudentService studentService,
                                         FacultyService facultyService,
                                         UserService userService,
                                         EmailParserService emailParserService) {
        this.studentService = studentService;
        this.facultyService = facultyService;
        this.userService = userService;
        this.emailParserService = emailParserService;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return null;
        if (authentication.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) authentication.getPrincipal()).getUsername();
        } else if (authentication.getPrincipal() instanceof String) {
            return (String) authentication.getPrincipal();
        }
        logger.warn("Unexpected authentication type: {}", authentication.getClass().getName());
        return null;
    }

    // --- Student Profile ---

    @GetMapping("/student/complete-profile")
    public ResponseEntity<?> getStudentProfile() {
        String email = getCurrentUserEmail();
        if (email == null) return ResponseEntity.status(401).body("Not authenticated");

        User user = userService.getUserByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("User not found");
        if (!"STUDENT".equalsIgnoreCase(user.getRole()) && !"ROLE_STUDENT".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Unauthorized access. Only students can access this page.");
        }

        boolean profileComplete = studentService.isProfileComplete(user.getId());
        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setStudentId(user.getId());

        Student existingStudent = studentService.getStudentById(user.getId());
        if (existingStudent != null) {
            studentDTO.setEnrollmentNumber(existingStudent.getEnrollmentNumber());
            studentDTO.setCourse(existingStudent.getCourse());
            studentDTO.setSemester(existingStudent.getSemester());
            studentDTO.setDepartment(existingStudent.getDepartment());
            studentDTO.setDateOfBirth(existingStudent.getDateOfBirth());
            studentDTO.setGender(existingStudent.getGender());
            studentDTO.setPhoneNumber(existingStudent.getPhoneNumber());
        } else {
            Map<String, String> parsedInfo = emailParserService.parseStudentEmail(email);
            if (parsedInfo != null) {
                studentDTO.setEnrollmentNumber(parsedInfo.get("enrollmentNumber"));
                studentDTO.setCourse(parsedInfo.get("course"));
                if (parsedInfo.get("semester") != null)
                    studentDTO.setSemester(Integer.parseInt(parsedInfo.get("semester")));
                studentDTO.setDepartment(parsedInfo.get("department"));
            }
        }

        return ResponseEntity.ok(Map.of(
            "profileComplete", profileComplete,
            "userName", user.getFirstName() + " " + user.getLastName(),
            "studentDTO", studentDTO
        ));
    }

    @PostMapping("/student/submit-profile")
    public ResponseEntity<?> submitStudentProfile(@RequestBody StudentDTO studentDTO) {
        String email = getCurrentUserEmail();
        if (email == null) return ResponseEntity.status(401).body("Not authenticated");

        User user = userService.getUserByEmail(email);
        if (user == null || !"STUDENT".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Unauthorized access.");
        }

        studentDTO.setStudentId(user.getId());

        try {
            studentService.saveStudent(studentDTO);
            return ResponseEntity.ok("Profile updated successfully!");
        } catch (Exception e) {
            logger.error("Error saving student profile", e);
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }

    // --- Faculty Profile ---

    @GetMapping("/faculty/complete-profile")
    public ResponseEntity<?> getFacultyProfile() {
        String email = getCurrentUserEmail();
        if (email == null) return ResponseEntity.status(401).body("Not authenticated");

        User user = userService.getUserByEmail(email);
        if (user == null || (!"FACULTY".equalsIgnoreCase(user.getRole()) && !"ROLE_FACULTY".equalsIgnoreCase(user.getRole()))) {
            return ResponseEntity.status(403).body("Unauthorized access. Only faculty can access this page.");
        }

        boolean profileComplete = facultyService.isProfileComplete(user.getId());
        FacultyDTO facultyDTO = new FacultyDTO();
        facultyDTO.setUserId(user.getId());

        Faculty existingFaculty = facultyService.getFacultyByUserId(user.getId());
        if (existingFaculty != null) {
            facultyDTO.setId(existingFaculty.getId());
            facultyDTO.setFacultyCode(existingFaculty.getFacultyCode());
            facultyDTO.setDepartment(existingFaculty.getDepartment());
            facultyDTO.setDesignation(existingFaculty.getDesignation());
            facultyDTO.setGender(existingFaculty.getGender());
            facultyDTO.setPhoneNumber(existingFaculty.getPhoneNumber());
            facultyDTO.setDateOfBirth(existingFaculty.getDateOfBirth());
        }

        return ResponseEntity.ok(Map.of(
            "profileComplete", profileComplete,
            "userName", user.getFirstName() + " " + user.getLastName(),
            "facultyDTO", facultyDTO
        ));
    }

    @PostMapping("/faculty/submit-profile")
    public ResponseEntity<?> submitFacultyProfile(@RequestBody FacultyDTO facultyDTO) {
        String email = getCurrentUserEmail();
        if (email == null) return ResponseEntity.status(401).body("Not authenticated");

        User user = userService.getUserByEmail(email);
        if (user == null || !"FACULTY".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Unauthorized access.");
        }

        facultyDTO.setUserId(user.getId());

        try {
            facultyService.saveFaculty(facultyDTO);
            return ResponseEntity.ok("Profile updated successfully!");
        } catch (Exception e) {
            logger.error("Error saving faculty profile", e);
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }
}
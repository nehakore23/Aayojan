package org.example.aayojan.Services;

import org.example.aayojan.DTO.UserDTO;
import org.example.aayojan.DTO.SignupRequest;
import org.example.aayojan.Entities.Student;
import org.example.aayojan.Entities.User;
import org.example.aayojan.Repositories.StudentRepository;
import org.example.aayojan.Repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
    }

    // Register a new user
    public void registerUser(UserDTO userDTO) {
        if (emailExists(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        String role = predictRole(userDTO.getEmail(), userDTO.getRole());
        String hashedPassword = passwordEncoder.encode(userDTO.getPassword());

        User user = new User(
                userDTO.getFirstName(),
                userDTO.getLastName(),
                userDTO.getEmail(),
                hashedPassword,
                role
        );
        userRepository.save(user);
    }

    // Authenticate for normal login
    public User authenticateUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email);
        return (user != null && passwordEncoder.matches(rawPassword, user.getPassword())) ? user : null;
    }

    // Predict role using email pattern
    public String predictRole(String email, String requestedRole) {
        if (email.endsWith("@charusat.edu.in") || email.endsWith("@charusat.ac.in")) {
            String emailPrefix = email.split("@")[0];
            if (emailPrefix.matches("\\d{2}[a-zA-Z]{2}\\d{3}")) {
                return "STUDENT";
            } else {
                return "FACULTY";
            }
        } else if (email.endsWith("@gmail.com")) {
            if ("STUDENT".equalsIgnoreCase(requestedRole) || "FACULTY".equalsIgnoreCase(requestedRole)) {
                return requestedRole.toUpperCase();
            } else {
                throw new RuntimeException("Invalid role for Gmail user. Only STUDENT or FACULTY allowed.");
            }
        } else {
            throw new RuntimeException("Invalid email domain! Only @charusat.edu.in, @charusat.ac.in, and @gmail.com are allowed.");
        }
    }

    // Check if email already exists
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email) != null;
    }

    // Get user by ID
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 🔹 New: Wrapper for email-based search
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 🔹 New: Handle Google Sign-In
    public User processGoogleUser(String email, String googleId, String firstName, String lastName,String role) {
        User user = findByEmail(email);

        if (user == null) {
            // Register a new user
            user = new User(firstName, lastName, email, googleId, role);
            user.setAuthProvider("GOOGLE");
            user.setGoogleId(googleId);
            user.setRole(role);
            userRepository.save(user);
        } else if (user.getGoogleId() == null) {
            // Link Google to existing account
            user.setGoogleId(googleId);
            user.setAuthProvider("GOOGLE");
            userRepository.save(user);
        }

        return user;
    }

    public void updateUser(User user) {
        
    }

    public void registerNewUser(SignupRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String roleToStore = predictRole(request.getEmail(), request.getRole());
        if (roleToStore.startsWith("ROLE_")) {
            roleToStore = roleToStore.substring(5);
        }

        User user = new User(
            request.getFirstName(),
            request.getLastName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            roleToStore
        );

        User savedUser = userRepository.save(user);
        logger.info("Saved User with ID: {} and Role: {}", savedUser.getId(), savedUser.getRole());

        // If the role is STUDENT, create and save a corresponding Student entity
        if ("STUDENT".equalsIgnoreCase(roleToStore)) {
            logger.info("Role is STUDENT for User ID: {}. Attempting to create Student entity.", savedUser.getId());
            Student student = new Student();
            student.setUser(savedUser);
            student.setCourse("N/A"); 
            student.setDepartment("N/A");
            student.setSemester(0); // Default for int
            student.setEnrollmentNumber("TEMP" + savedUser.getId()); 
            try {
                Student savedStudent = studentRepository.save(student);
                logger.info("Successfully saved Student entity with ID: {} linked to User ID: {}", savedStudent.getStudentId(), savedUser.getId());
            } catch (Exception e) {
                logger.error("Error saving Student entity for User ID: {}: {}", savedUser.getId(), e.getMessage(), e);
            }
        } else {
            logger.info("Role is NOT STUDENT for User ID: {}. Role: {}. Skipping Student entity creation.", savedUser.getId(), roleToStore);
        }

        System.out.println("Password: " + request.getPassword());
        System.out.println("ConfirmPassword: " + request.getConfirmPassword());
    }
}

package org.example.aayojan.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmailParserService {
    private static final Logger logger = LoggerFactory.getLogger(EmailParserService.class);

    // Regular expression to extract components from email IDs like 23ce092@charusat.edu.in
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^(\\d{2})([a-zA-Z]{2})(\\d+)@charusat\\.edu\\.in$");

    // Map to store department codes and their full names
    private static final Map<String, String> DEPARTMENT_MAP = new HashMap<>();

    static {
        DEPARTMENT_MAP.put("ce", "Computer Engineering");
        DEPARTMENT_MAP.put("cs", "Computer Engineering");
        DEPARTMENT_MAP.put("it", "Information Technology");
        DEPARTMENT_MAP.put("ec", "Electronics & Communication");
        DEPARTMENT_MAP.put("ee", "Electrical Engineering");
        DEPARTMENT_MAP.put("me", "Mechanical Engineering");
        DEPARTMENT_MAP.put("cv", "Civil Engineering");
        // Add more departments as needed
    }

    // Map department codes to courses
    private static final Map<String, String> COURSE_MAP = new HashMap<>();

    static {
        COURSE_MAP.put("ce", "B.Tech");
        COURSE_MAP.put("cs", "B.Tech");
        COURSE_MAP.put("it", "B.Tech");
        COURSE_MAP.put("ec", "B.Tech");
        COURSE_MAP.put("ee", "B.Tech");
        COURSE_MAP.put("me", "B.Tech");
        COURSE_MAP.put("cv", "B.Tech");
        // Add more course mappings as needed
    }

    /**
     * Parses student email to extract admission year, department, and enrollment number
     *
     * @param email Student email in format like 23ce092@charusat.edu.in
     * @return Map containing extracted information or null if email doesn't match pattern
     */
    public Map<String, String> parseStudentEmail(String email) {
        if (email == null || email.isEmpty()) {
            return null;
        }

        Matcher matcher = EMAIL_PATTERN.matcher(email);
        if (!matcher.matches()) {
            logger.debug("Email doesn't match expected pattern: {}", email);
            return null;
        }

        String yearCode = matcher.group(1);
        String deptCode = matcher.group(2).toLowerCase();
        String rollNumber = matcher.group(3);

        Map<String, String> result = new HashMap<>();

        // Calculate full admission year (assuming 20xx for simplicity)
        String admissionYear = "20" + yearCode;
        result.put("admissionYear", admissionYear);

        // Calculate current semester based on admission year
        int semester = calculateCurrentSemester(Integer.parseInt(admissionYear));
        result.put("semester", String.valueOf(semester));

        // Get department name
        String department = DEPARTMENT_MAP.getOrDefault(deptCode, "Unknown Department");
        result.put("department", department);

        // Get course
        String course = COURSE_MAP.getOrDefault(deptCode, "Unknown Course");
        result.put("course", course);

        // Build enrollment number (could be just the email prefix or formatted differently)
        String enrollmentNumber = yearCode.toUpperCase() + deptCode.toUpperCase() + rollNumber;
        result.put("enrollmentNumber", enrollmentNumber);

        logger.debug("Parsed email {} - Year: {}, Dept: {}, Roll: {}, Semester: {}",
                email, yearCode, deptCode, rollNumber, semester);

        return result;
    }

    /**
     * Calculates current semester based on admission year
     *
     * @param admissionYear Year when student was admitted
     * @return Current semester number
     */
    private int calculateCurrentSemester(int admissionYear) {
        LocalDate currentDate = LocalDate.now();
        int currentYear = currentDate.getYear();
        int yearDifference = currentYear - admissionYear;

        // Calculate base number of completed semesters
        int completedSemesters = yearDifference * 2;

        // Determine current semester based on month
        int currentMonth = currentDate.getMonth().getValue();
        int currentSemester;

        // In India, academic calendar typically has:
        // First semester: July/August to December (odd semester)
        // Second semester: January to May/June (even semester)

        if (currentMonth >= Month.JULY.getValue()) {
            // Second half of year: odd-numbered semester
            currentSemester = completedSemesters + 1;
        } else {
            // First half of year: even-numbered semester
            currentSemester = completedSemesters + 2;
        }

        // Special case for students admitted in the current year
        if (admissionYear == currentYear) {
            currentSemester = currentMonth >= Month.JULY.getValue() ? 1 : 0;
        }

        // Ensure semester is within bounds (1-8 for B.Tech)
        return Math.min(Math.max(currentSemester, 1), 8)-2;
    }
}
package org.example.aayojan.Repositories;

import org.example.aayojan.Entities.Event;
import org.example.aayojan.Entities.Faculty;
import org.example.aayojan.Entities.Student;
import org.example.aayojan.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Find student by User entity
    Optional<Student> findByUser(User user);

    // Find students by department
    List<Student> findByDepartment(String department);

    // Find students by semester
    List<Student> findBySemester(Integer semester);

    // Check if a student exists by Enrollment Number
    boolean existsByEnrollmentNumber(String enrollmentNumber);

    @Query("SELECT s.enrollmentNumber FROM Student s")
    List<String> findAllEnrollmentNumbers();

    Student findByEnrollmentNumber(String enrollmentNumber);

    Optional<Student> findByUser_Id(Long id);

    @Query("SELECT s.coordinatedEvents FROM Student s WHERE s.studentId = :studentId")
    List<Event> findCoordinatedEventsByStudentId(@Param("studentId") Long studentId);

}

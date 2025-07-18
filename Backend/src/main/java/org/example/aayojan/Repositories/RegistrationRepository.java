package org.example.aayojan.Repositories;

import org.example.aayojan.Entities.Event;
import org.example.aayojan.Entities.Registration;
import org.example.aayojan.Entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Registration findByTicketId(String ticketId);

    Optional<Registration> findByEventAndStudent(Event event, Student student);
    Optional<Registration> findByEvent_EventIdAndStudent_StudentId(Integer eventId, Long studentId);

    List<Registration> findByStudent(Student student);

    List<Registration> findByEvent(Event event);

    boolean existsByStudentAndEvent(Student student, Event event);
}

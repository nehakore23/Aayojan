package org.example.aayojan.Repositories;

import org.example.aayojan.Entities.Event;
import org.example.aayojan.Entities.Faculty;
import org.example.aayojan.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepo extends JpaRepository<Faculty, Long> {
    Faculty findByUser_Id(Long userId);
   Faculty findByUserEmail(String email);

    List<Faculty> findByUser_FirstNameInAndUser_LastNameIn(List<String> firstnames, List<String> lastnames);
    Optional<Faculty> findByUser(User user);
    @Query("SELECT f.coordinatedEvents FROM Faculty f WHERE f.id = :facultyId")
    List<Event> findCoordinatedEventsByFacultyId(@Param("facultyId") Long facultyId);

    Optional<Faculty> findByUserId(Long id);
}

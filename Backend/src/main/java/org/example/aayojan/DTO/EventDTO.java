package org.example.aayojan.DTO;

import lombok.Data;
import org.example.aayojan.Entities.Faculty;
import org.springframework.cglib.core.Local;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.sql.Date;
import java.util.List;

@Data
public class EventDTO {


    private int eventId;

    private String location;

    //private MultipartFile thumbnail;
    private String imageUrl;

    private String title;
    private String description;
    //@DateTimeFormat(pattern = "yyyy-MM-dd")  // Ensure correct format
    private LocalDate date;
    private String month;
    private int day;
    private int assignedBy;

    int published=0;

    private LocalTime time;

    List<String> allStudentIds ;

    int stdCoordinatorsCount;
    List<String> studentCoordinators ;

    List<String> facultyCoordinators;

}
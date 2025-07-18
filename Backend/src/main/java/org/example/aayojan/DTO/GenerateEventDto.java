package org.example.aayojan.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class GenerateEventDto {

    private Integer id;

    @NotBlank(message = "Event name cannot be blank")
    private String eventName;

    private int noOfFaculty;

    private LocalDate eventDate;

    // This field is for output only, not required in POST requests
    private List<String> allfacultyNames;

    @NotEmpty(message = "At least one faculty coordinator must be assigned.")
    private List<Long> assignedFacultyIds = new ArrayList<>();
}
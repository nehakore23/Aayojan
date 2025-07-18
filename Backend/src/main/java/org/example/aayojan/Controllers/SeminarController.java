package org.example.aayojan.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SeminarController {

    @GetMapping("/seminars")
    public String showSeminars(Model model) {
   
        return "seminars";
    }
} 
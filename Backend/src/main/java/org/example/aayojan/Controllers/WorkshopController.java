package org.example.aayojan.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WorkshopController {

    @GetMapping("/workshops")
    public String showWorkshops(Model model) {
        // TODO: Add workshop data to model
        return "workshops";
    }
} 
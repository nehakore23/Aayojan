package org.example.aayojan.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    // Get current user's settings 
    @GetMapping
    public ResponseEntity<?> getSettings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return ResponseEntity.ok(Map.of("username", username));
    }

    // Update settings
    @PostMapping("/update")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, Object> settings) {

        //  update user preferences, password, etc.
        return ResponseEntity.ok(Map.of("success", true, "message", "Settings updated successfully!"));
    }
}
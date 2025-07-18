// package org.example.aayojan.Controllers;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.example.aayojan.Services.UserService;
// import org.example.aayojan.DTO.LoginRequest;

// @RestController
// public class LoginApiController {

//     @Autowired
//     private UserService userService; // Make sure you have this service

//     @PostMapping("/api/auth/login")
//     public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//         // Use authenticateUser which returns a User object or null
//         org.example.aayojan.Entities.User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
//         if (user != null) {
//             // You can return a token or user info as needed
//             return ResponseEntity.ok().body("{\"message\": \"Login successful!\"}");
//         } else {
//             return ResponseEntity.status(401).body("{\"error\": \"Invalid username or password.\"}");
//         }
//     }
// }
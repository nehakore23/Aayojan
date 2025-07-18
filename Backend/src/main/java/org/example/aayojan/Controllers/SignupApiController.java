// package org.example.aayojan.Controllers;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.example.aayojan.Services.UserService;
// import org.example.aayojan.DTO.SignupRequest;

// // @CrossOrigin(origins = "*")
// @RestController
// public class SignupApiController {

//     @Autowired
//     private UserService userService;

//     @PostMapping("/api/signup")
//     public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
//         try {
//             userService.registerNewUser(signupRequest);
//             return ResponseEntity.ok().body("{\"message\": \"Registration successful!\"}");
//         } catch (Exception e) {
//             return ResponseEntity.status(400).body("{\"error\": \"" + e.getMessage() + "\"}");
//         }
//     }
// }
// package org.example.aayojan.Controllers;

// import org.example.aayojan.DTO.SignupRequest;
// import org.example.aayojan.Services.UserService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Controller;
// import org.springframework.ui.Model;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.ModelAttribute;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.servlet.mvc.support.RedirectAttributes;

// @Controller
// public class SignupController {

//     @Autowired
//     private UserService userService;

//     @GetMapping("/signup")
//     public String showSignupForm(Model model) {
//         model.addAttribute("signupRequest", new SignupRequest());
//         return "signup";
//     }

//     @PostMapping("/signup")
//     public String processSignup(@ModelAttribute SignupRequest signupRequest, RedirectAttributes redirectAttributes) {
//         try {
//             userService.registerNewUser(signupRequest);
//             redirectAttributes.addFlashAttribute("successMessage", "Registration successful! Please login.");
//             return "redirect:/login";
//         } catch (Exception e) {
//             redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
//             return "redirect:/signup";
//         }
//     }
// } 
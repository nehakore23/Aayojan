package org.example.aayojan.Controllers;

import org.example.aayojan.Services.EmailService;
import org.example.aayojan.Services.ForgotPasswordService;
import org.example.aayojan.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/forgot-password")
public class ForgotPasswordController {

    @Autowired
    private UserService userService;
    @Autowired
    private ForgotPasswordService forgotPasswordService;
    @Autowired
    private EmailService emailService;

    // 1. Send verification code (OTP) to email
    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (!userService.emailExists(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email not found in our records."));
        }
        String otp = forgotPasswordService.generateAndStoreOtp(email);
        emailService.sendOtpEmail(email, otp);
        return ResponseEntity.ok(Map.of("message", "OTP sent to email.", "email", email));
    }

    // 2. Verify OTP
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        if (!forgotPasswordService.verifyPasswordResetCode(email, otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid verification code."));
        }
        String resetToken = forgotPasswordService.generatePasswordResetToken(email);
        return ResponseEntity.ok(Map.of("message", "OTP verified.", "email", email, "token", resetToken));
    }

    // 3. Validate reset token (optional, for frontend to check before showing reset form)
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String token = body.get("token");
        if (!forgotPasswordService.validatePasswordResetToken(email, token)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired reset token."));
        }
        return ResponseEntity.ok(Map.of("message", "Token valid."));
    }

    // 4. Reset password
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        String confirmPassword = body.get("confirmPassword");

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Passwords do not match."));
        }

        try {
            forgotPasswordService.resetPassword(email, token, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password reset successful! Please login."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reset password: " + e.getMessage()));
        }
    }
}
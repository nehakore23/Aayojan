package org.example.aayojan.Services;

import org.example.aayojan.Entities.User;
import org.example.aayojan.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private Map<String, Long> otpTimestamps = new ConcurrentHashMap<>();
    private Map<String, String> resetTokens = new ConcurrentHashMap<>();
    private Map<String, Long> tokenTimestamps = new ConcurrentHashMap<>();

    private static final long OTP_VALIDITY_MINUTES = 10;
    private static final long TOKEN_VALIDITY_MINUTES = 30;

    // Generate and send OTP for password reset
    public void sendPasswordResetCode(String email) {
        if (!emailExists(email)) {
            throw new RuntimeException("Email not found.");
        }

        String otp = generateAndStoreOtp(email); // Generate and store OTP correctly
        System.out.println("OTP for " + email + ": " + otp); // Simulated email (replace with actual email service)
    }

    // Generate and store OTP
    public String generateAndStoreOtp(String email) {
        String otp = String.valueOf(1000 + new Random().nextInt(9000)); // Generates 4-digit OTP
        otpStorage.put(email, otp);
        otpTimestamps.put(email, System.currentTimeMillis());
        return otp;
    }

    // Verify OTP
    public boolean verifyPasswordResetCode(String email, String otp) {
        if (!otpStorage.containsKey(email) || !otpTimestamps.containsKey(email)) {
            return false; // No OTP found for this email
        }

        String storedOTP = otpStorage.get(email);
        Long timestamp = otpTimestamps.get(email);

        long elapsedMinutes = TimeUnit.MILLISECONDS.toMinutes(System.currentTimeMillis() - timestamp);
        if (elapsedMinutes > OTP_VALIDITY_MINUTES) {
            otpStorage.remove(email);
            otpTimestamps.remove(email);
            return false; // OTP expired
        }

        boolean isValid = storedOTP.equals(otp);
        if (isValid) {
            otpStorage.remove(email);
            otpTimestamps.remove(email);
        }

        return isValid;
    }

    // Generate password reset token
    public String generatePasswordResetToken(String email) {
        if (!emailExists(email)) {
            throw new RuntimeException("Email not found.");
        }

        String token = UUID.randomUUID().toString();
        resetTokens.put(email, token);
        tokenTimestamps.put(email, System.currentTimeMillis());

        return token;
    }

    // Validate password reset token
    public boolean validatePasswordResetToken(String email, String token) {
        if (!resetTokens.containsKey(email) || !tokenTimestamps.containsKey(email)) {
            return false;
        }

        Long timestamp = tokenTimestamps.get(email);
        long elapsedMinutes = TimeUnit.MILLISECONDS.toMinutes(System.currentTimeMillis() - timestamp);
        if (elapsedMinutes > TOKEN_VALIDITY_MINUTES) {
            resetTokens.remove(email);
            tokenTimestamps.remove(email);
            return false;
        }

        return resetTokens.get(email).equals(token);
    }

    // Reset password
    public void resetPassword(String email, String token, String newPassword) {
        if (!validatePasswordResetToken(email, token)) {
            throw new RuntimeException("Invalid or expired reset token.");
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetTokens.remove(email);
        tokenTimestamps.remove(email);
    }

    private boolean emailExists(String email) {
        return userRepository.findByEmail(email) != null;
    }
}
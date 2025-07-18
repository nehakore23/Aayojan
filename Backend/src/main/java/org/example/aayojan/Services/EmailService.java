package org.example.aayojan.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Your OTP for Password Reset - Aayojan.com");

            String emailContent = "<html>"
                    + "<body>"
                    + "<h2 style='color: #333;'>Password Reset OTP</h2>"
                    + "<p>Dear User,</p>"
                    + "<p>We received a request to reset your password.</p>"
                    + "<p>Your One-Time Password (OTP) is:</p>"
                    + "<h3 style='color: #2D89EF;'>" + otp + "</h3>"
                    + "<p>Please enter this OTP on the password reset page to continue.</p>"
                    + "<p>If you did not request this, please ignore this email.</p>"
                    + "<br>"
                    + "<p>Best Regards,</p>"
                    + "<p><strong>Aayojan.com Team</strong></p>"
                    + "</body>"
                    + "</html>";

            helper.setText(emailContent, true);

            mailSender.send(message);
            System.out.println("OTP email sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Failed to send OTP email.");
        }
    }

    public void sendFacultyProfileNotification(String toEmail, String facultyName, String facultyId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("New Faculty Profile Created - Aayojan.com");

            String emailContent = "<html>"
                    + "<body>"
                    + "<h2 style='color: #333;'>New Faculty Profile Created</h2>"
                    + "<p>Dear Event Authority,</p>"
                    + "<p>A new faculty profile has been created in the system:</p>"
                    + "<ul>"
                    + "<li><strong>Faculty Name:</strong> " + facultyName + "</li>"
                    + "<li><strong>Faculty ID:</strong> " + facultyId + "</li>"
                    + "</ul>"
                    + "<p>You can review and manage faculty profiles through the Event Authority dashboard.</p>"
                    + "<br>"
                    + "<p>Best Regards,</p>"
                    + "<p><strong>Aayojan.com Team</strong></p>"
                    + "</body>"
                    + "</html>";

            helper.setText(emailContent, true);

            mailSender.send(message);
            System.out.println("Faculty profile notification email sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Failed to send faculty profile notification email.");
        }
    }
}


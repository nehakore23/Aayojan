package org.example.aayojan.Controllers;

import org.example.aayojan.Entities.Contact;
import org.example.aayojan.Repositories.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactRepository contactRepository;

    @Autowired
    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // GET: /api/contact/form
    @GetMapping("/form")
    public Map<String, String> showContactForm() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Contact form endpoint. Use POST to submit your message.");
        return response;
    }

    // POST: /api/contact/submit
    @PostMapping("/submit")
    public Map<String, String> submitContactForm(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String message) {

        // Save to database
        Contact contact = new Contact(name, email, message);
        contactRepository.save(contact);

        // Return response
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Thank you for your message. We'll get back to you soon!");
        return response;
    }
}

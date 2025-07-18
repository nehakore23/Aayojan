package org.example.aayojan.Services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.example.aayojan.Entities.Event;
import org.example.aayojan.Entities.Registration;
import org.example.aayojan.Entities.Student;
import org.example.aayojan.Repositories.EventRepo;
import org.example.aayojan.Repositories.RegistrationRepository;
import org.example.aayojan.Repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventRegistrationService {

    @Autowired
    private EventRepo eventRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    public Registration registerStudentForEvent(Integer eventId, Long studentId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if already registered
        Optional<Registration> existingRegistration = registrationRepository.findByEvent_EventIdAndStudent_StudentId(eventId, studentId);
        if (existingRegistration.isPresent()) {
            throw new RuntimeException("Student already registered for this event");
        }

        Registration registration = new Registration();
        registration.setTicketId(UUID.randomUUID().toString());
        registration.setEvent(event);
        registration.setStudent(student);
        registration.setRegistrationTime(LocalDateTime.now());
        registration.setAttended(false);

        return registrationRepository.save(registration);
    }

    public byte[] generateTicketPdf(Long registrationId) throws IOException, WriterException {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Set page margins
        document.setMargins(20, 30, 20, 30);

        // Ticket Border Box
        Table outerBox = new Table(1);
        outerBox.setWidth(UnitValue.createPercentValue(100))
                .setBorder(new SolidBorder(ColorConstants.BLACK, 2))
                .setBackgroundColor(new DeviceRgb(245, 245, 245))
                .setPadding(10);

        // Header
        Paragraph header = new Paragraph("🎫 Event Ticket 🎫")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(24)
                .setBold()
                .setFontColor(ColorConstants.BLUE)
                .setMarginBottom(20);

        // Details Table
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                .setWidth(UnitValue.createPercentValue(100))
                .setMarginBottom(20);

        infoTable.addCell(getStyledCell("Event:", true));
        infoTable.addCell(getStyledCell(registration.getEvent().getTitle(), false));
        infoTable.addCell(getStyledCell("Student:", true));
        infoTable.addCell(getStyledCell(registration.getStudent().getUser().getName(), false));
        infoTable.addCell(getStyledCell("Enrollment:", true));
        infoTable.addCell(getStyledCell(registration.getStudent().getEnrollmentNumber(), false));
        infoTable.addCell(getStyledCell("Date:", true));
        infoTable.addCell(getStyledCell(String.valueOf(registration.getEvent().getDate()), false));
        infoTable.addCell(getStyledCell("Time:", true));
        infoTable.addCell(getStyledCell(String.valueOf(registration.getEvent().getTime()), false));
        infoTable.addCell(getStyledCell("Location:", true));
        infoTable.addCell(getStyledCell(registration.getEvent().getLocation(), false));
        infoTable.addCell(getStyledCell("Ticket ID:", true));
        infoTable.addCell(getStyledCell(registration.getTicketId(), false));

        // Generate QR Code
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(
                registration.getTicketId(), BarcodeFormat.QR_CODE, 200, 200);
        ByteArrayOutputStream qrBaos = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", qrBaos);
        Image qrImage = new Image(ImageDataFactory.create(qrBaos.toByteArray()))
                .setWidth(150)
                .setHeight(150)
                .setHorizontalAlignment(HorizontalAlignment.CENTER);

        // Add to outer box
        outerBox.addCell(new Cell().add(header).setBorder(Border.NO_BORDER));
        outerBox.addCell(new Cell().add(infoTable).setBorder(Border.NO_BORDER));
        outerBox.addCell(new Cell().add(qrImage).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.CENTER));

        document.add(outerBox);
        document.close();

        return baos.toByteArray();
    }

    // Helper method for styled cells
    private Cell getStyledCell(String text, boolean isBold) {
        // Prevent iText from crashing due to null
        if (text == null) {
            text = "N/A";
        }

        Paragraph paragraph = new Paragraph(text)
                .setFontSize(12)
                .setFontColor(isBold ? ColorConstants.BLACK : ColorConstants.DARK_GRAY);
        if (isBold) paragraph.setBold();

        return new Cell()
                .add(paragraph)
                .setBorder(Border.NO_BORDER)
                .setPadding(5);
    }


    public void markAttendance(String ticketId) {
        Registration registration = registrationRepository.findByTicketId(ticketId);
        if (registration == null) {
            throw new RuntimeException("Invalid ticket ID");
        }
        registration.setAttended(true);
        registrationRepository.save(registration);
    }

    /**
     * Get all registrations for a specific student
     */
    public List<Registration> getRegistrationsByStudent(Student student) {
        return registrationRepository.findByStudent(student);
    }

    /**
     * Get all registrations for a specific event
     */
    public List<Registration> getRegistrationsByEvent(Event event) {
        return registrationRepository.findByEvent(event);
    }

    /**
     * Check if a student is registered for an event
     */
    public boolean isStudentRegisteredForEvent(Student student, Event event) {
        return registrationRepository.existsByStudentAndEvent(student, event);
    }
}
package com.example.ticketbooking;

import com.example.ticketbooking.dto.*;
import com.example.ticketbooking.exception.ResourceNotFoundException;
import com.example.ticketbooking.exception.SeatUnavailableException;
import com.example.ticketbooking.model.*;
import com.example.ticketbooking.repository.*;
import com.example.ticketbooking.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class TicketBookingApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private EventService eventService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private Event testEvent;
    private User testUser;

    @BeforeEach
    void setUp() {
        bookingRepository.deleteAll();
        eventRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("testuser@example.com");
        registerRequest.setPassword("password123");
        authService.register(registerRequest);

        testUser = userRepository.findByEmail("testuser@example.com").orElseThrow();

        // Create test event
        EventRequest eventRequest = new EventRequest();
        eventRequest.setTitle("JUnit Test Concert");
        eventRequest.setDescription("A test event for unit testing");
        eventRequest.setLocation("Test Stadium, CA");
        eventRequest.setEventDate(LocalDate.now().plusDays(10));
        eventRequest.setEventTime(LocalTime.of(19, 0));
        eventRequest.setTotalSeats(10);
        eventRequest.setTicketPrice(BigDecimal.valueOf(100.0));
        eventRequest.setImageUrl("https://example.com/image.jpg");

        EventResponse createdEvent = eventService.createEvent(eventRequest);
        testEvent = eventRepository.findById(createdEvent.getId()).orElseThrow();
    }

    @Test
    @DisplayName("1. Test User Registration and Login Flow")
    void testUserRegistrationAndLogin() {
        RegisterRequest reg = new RegisterRequest();
        reg.setName("Jane Smith");
        reg.setEmail("jane@example.com");
        reg.setPassword("secret123");

        LoginResponse regResponse = authService.register(reg);
        assertNotNull(regResponse.getToken());
        assertEquals("jane@example.com", regResponse.getEmail());

        LoginRequest login = new LoginRequest();
        login.setEmail("jane@example.com");
        login.setPassword("secret123");

        LoginResponse loginResponse = authService.login(login);
        assertNotNull(loginResponse.getToken());
        assertEquals(Role.USER, loginResponse.getRole());
    }

    @Test
    @DisplayName("2. Test Event Retrieval and Search")
    void testEventRetrieval() {
        List<EventResponse> events = eventService.getAllEvents("JUnit");
        assertFalse(events.isEmpty());
        assertEquals("JUnit Test Concert", events.get(0).getTitle());
    }

    @Test
    @DisplayName("3. Test Successful Ticket Booking and Seat Decrement")
    void testSuccessfulTicketBooking() {
        BookingRequest request = new BookingRequest();
        request.setEventId(testEvent.getId());
        request.setQuantity(2);

        BookingResponse booking = bookingService.createBooking(testUser.getEmail(), request);

        assertNotNull(booking.getBookingReference());
        assertTrue(booking.getBookingReference().startsWith("TB-"));
        assertEquals(2, booking.getQuantity());
        assertEquals(BigDecimal.valueOf(200.0), booking.getTotalAmount());
        assertEquals(BookingStatus.CONFIRMED, booking.getBookingStatus());

        // Verify available seats decreased
        Event updatedEvent = eventRepository.findById(testEvent.getId()).orElseThrow();
        assertEquals(8, updatedEvent.getAvailableSeats());
    }

    @Test
    @DisplayName("4. Test Booking with Insufficient Available Seats Exception")
    void testBookingInsufficientSeats() {
        BookingRequest request = new BookingRequest();
        request.setEventId(testEvent.getId());
        request.setQuantity(15); // Exceeds available seats (10)

        assertThrows(SeatUnavailableException.class, () -> {
            bookingService.createBooking(testUser.getEmail(), request);
        });
    }

    @Test
    @DisplayName("5. Test Booking Cancellation and Seat Restoration")
    void testBookingCancellation() {
        BookingRequest request = new BookingRequest();
        request.setEventId(testEvent.getId());
        request.setQuantity(3);

        BookingResponse booking = bookingService.createBooking(testUser.getEmail(), request);
        assertEquals(7, eventRepository.findById(testEvent.getId()).orElseThrow().getAvailableSeats());

        // Cancel booking
        BookingResponse cancelled = bookingService.cancelBooking(testUser.getEmail(), booking.getId());
        assertEquals(BookingStatus.CANCELLED, cancelled.getBookingStatus());

        // Verify seats restored back to 10
        assertEquals(10, eventRepository.findById(testEvent.getId()).orElseThrow().getAvailableSeats());
    }

    @Test
    @DisplayName("6. Test Admin Dashboard Metrics Aggregation")
    void testAdminDashboardMetrics() {
        DashboardResponse metrics = adminService.getDashboardMetrics();
        assertNotNull(metrics);
        assertTrue(metrics.getTotalEvents() >= 1);
        assertTrue(metrics.getTotalUsers() >= 1);
    }
}

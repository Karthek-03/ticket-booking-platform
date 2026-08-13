package com.example.ticketbooking.controller;

import com.example.ticketbooking.dto.ApiResponse;
import com.example.ticketbooking.dto.BookingRequest;
import com.example.ticketbooking.dto.BookingResponse;
import com.example.ticketbooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            Authentication authentication,
            @Valid @RequestBody BookingRequest request) {
        String userEmail = authentication.getName();
        BookingResponse response = bookingService.createBooking(userEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking confirmed successfully", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        List<BookingResponse> bookings = bookingService.getUserBookings(userEmail);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            Authentication authentication,
            @PathVariable Long id) {
        String userEmail = authentication.getName();
        BookingResponse booking = bookingService.getBookingById(userEmail, id);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            Authentication authentication,
            @PathVariable Long id) {
        String userEmail = authentication.getName();
        BookingResponse response = bookingService.cancelBooking(userEmail, id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", response));
    }
}

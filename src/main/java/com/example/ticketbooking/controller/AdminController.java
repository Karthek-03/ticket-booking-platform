package com.example.ticketbooking.controller;

import com.example.ticketbooking.dto.ApiResponse;
import com.example.ticketbooking.dto.BookingResponse;
import com.example.ticketbooking.dto.DashboardResponse;
import com.example.ticketbooking.model.BookingStatus;
import com.example.ticketbooking.model.User;
import com.example.ticketbooking.repository.UserRepository;
import com.example.ticketbooking.service.AdminService;
import com.example.ticketbooking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final BookingService bookingService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardMetrics() {
        DashboardResponse metrics = adminService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard metrics retrieved", metrics));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) BookingStatus status) {
        List<BookingResponse> bookings = bookingService.getAllBookingsForAdmin(status);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }
}

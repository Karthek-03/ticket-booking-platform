package com.example.ticketbooking.service;

import com.example.ticketbooking.dto.DashboardResponse;
import com.example.ticketbooking.repository.BookingRepository;
import com.example.ticketbooking.repository.EventRepository;
import com.example.ticketbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public DashboardResponse getDashboardMetrics() {
        return DashboardResponse.builder()
                .totalEvents(eventRepository.countTotalEvents())
                .totalUsers(userRepository.count())
                .totalBookings(bookingRepository.count())
                .totalTicketsSold(bookingRepository.sumTotalTicketsSold())
                .totalRevenue(bookingRepository.sumTotalRevenue())
                .build();
    }
}

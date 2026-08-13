package com.example.ticketbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalEvents;
    private Long totalUsers;
    private Long totalBookings;
    private Long totalTicketsSold;
    private BigDecimal totalRevenue;
}

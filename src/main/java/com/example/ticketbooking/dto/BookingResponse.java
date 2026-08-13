package com.example.ticketbooking.dto;

import com.example.ticketbooking.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private String eventDate;
    private String eventTime;
    private Integer quantity;
    private BigDecimal totalAmount;
    private BookingStatus bookingStatus;
    private LocalDateTime createdAt;
}

package com.example.ticketbooking.repository;

import com.example.ticketbooking.model.Booking;
import com.example.ticketbooking.model.BookingStatus;
import com.example.ticketbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByBookingStatusOrderByCreatedAtDesc(BookingStatus bookingStatus);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.event.id = :eventId AND b.bookingStatus = 'CONFIRMED'")
    Long countActiveBookingsByEventId(@Param("eventId") Long eventId);

    @Query("SELECT COALESCE(SUM(b.quantity), 0) FROM Booking b WHERE b.bookingStatus = 'CONFIRMED'")
    Long sumTotalTicketsSold();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus = 'CONFIRMED'")
    BigDecimal sumTotalRevenue();
}

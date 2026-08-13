package com.example.ticketbooking.repository;

import com.example.ticketbooking.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);
    
    @Query("SELECT COUNT(e) FROM Event e")
    Long countTotalEvents();
}

package com.example.ticketbooking.service;

import com.example.ticketbooking.dto.EventRequest;
import com.example.ticketbooking.dto.EventResponse;
import com.example.ticketbooking.exception.ResourceNotFoundException;
import com.example.ticketbooking.model.Event;
import com.example.ticketbooking.repository.BookingRepository;
import com.example.ticketbooking.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    public List<EventResponse> getAllEvents(String query) {
        List<Event> events;
        if (query != null && !query.trim().isEmpty()) {
            events = eventRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(query.trim(), query.trim());
        } else {
            events = eventRepository.findAll();
        }

        return events.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return mapToResponse(event);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .eventTime(request.getEventTime())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .ticketPrice(request.getTicketPrice())
                .imageUrl(request.getImageUrl())
                .build();

        Event savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        int seatDifference = request.getTotalSeats() - event.getTotalSeats();
        int newAvailableSeats = event.getAvailableSeats() + seatDifference;

        if (newAvailableSeats < 0) {
            throw new IllegalArgumentException("Cannot reduce total seats below currently booked quantity");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setTotalSeats(request.getTotalSeats());
        event.setAvailableSeats(newAvailableSeats);
        event.setTicketPrice(request.getTicketPrice());
        event.setImageUrl(request.getImageUrl());

        Event updatedEvent = eventRepository.save(event);
        return mapToResponse(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        Long activeBookings = bookingRepository.countActiveBookingsByEventId(id);
        if (activeBookings > 0) {
            throw new IllegalStateException("Cannot delete event with " + activeBookings + " active confirmed booking(s)");
        }

        eventRepository.delete(event);
    }

    public EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .eventDate(event.getEventDate())
                .eventTime(event.getEventTime())
                .totalSeats(event.getTotalSeats())
                .availableSeats(event.getAvailableSeats())
                .ticketPrice(event.getTicketPrice())
                .imageUrl(event.getImageUrl())
                .createdAt(event.getCreatedAt())
                .build();
    }
}

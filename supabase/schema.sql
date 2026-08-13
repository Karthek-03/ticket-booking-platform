-- =============================================================================
-- Simple Ticket Booking System - Supabase PostgreSQL Schema & RPC Functions
-- =============================================================================

-- Drop tables if exists (for clean re-runs)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS reserve_seats_atomic;

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 2. EVENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    total_seats INT NOT NULL CHECK (total_seats > 0),
    available_seats INT NOT NULL CHECK (available_seats >= 0),
    ticket_price DECIMAL(10, 2) NOT NULL CHECK (ticket_price >= 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_available_seats ON events(available_seats);

-- -----------------------------------------------------------------------------
-- 3. BOOKINGS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    booking_status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    booking_reference VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_event ON bookings(event_id);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);

-- -----------------------------------------------------------------------------
-- 4. ATOMIC SEAT RESERVATION FUNCTION (RPC)
-- Race-condition safe seat locking in PostgreSQL
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reserve_seats_atomic(
    p_event_id BIGINT,
    p_user_id BIGINT,
    p_quantity INT,
    p_booking_ref VARCHAR
) RETURNS BIGINT AS $$
DECLARE
    v_available_seats INT;
    v_ticket_price DECIMAL(10, 2);
    v_total_amount DECIMAL(10, 2);
    v_booking_id BIGINT;
BEGIN
    -- Lock the event row for update to prevent concurrent overbooking
    SELECT available_seats, ticket_price INTO v_available_seats, v_ticket_price
    FROM events
    WHERE id = p_event_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Event with ID % not found', p_event_id;
    END IF;

    IF v_available_seats < p_quantity THEN
        RAISE EXCEPTION 'Not enough seats available. Requested: %, Available: %', p_quantity, v_available_seats;
    END IF;

    -- Calculate total price
    v_total_amount := v_ticket_price * p_quantity;

    -- Create booking record
    INSERT INTO bookings (user_id, event_id, quantity, total_amount, booking_status, booking_reference, created_at)
    VALUES (p_user_id, p_event_id, p_quantity, v_total_amount, 'CONFIRMED', p_booking_ref, NOW())
    RETURNING id INTO v_booking_id;

    -- Decrease available seats
    UPDATE events
    SET available_seats = available_seats - p_quantity
    WHERE id = p_event_id;

    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 5. SAMPLE SEED DATA
-- -----------------------------------------------------------------------------

-- Admin & Standard User (BCrypt encoded passwords: 'password123')
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$e7xVp3ZkH8cW4rN1aT8.5.j9yW4N1aT8.5.j9yW4N1aT8.5.j9yW4', 'ADMIN'),
('John Doe', 'user@example.com', '$2a$10$e7xVp3ZkH8cW4rN1aT8.5.j9yW4N1aT8.5.j9yW4N1aT8.5.j9yW4', 'USER');

-- Sample Events
INSERT INTO events (title, description, location, event_date, event_time, total_seats, available_seats, ticket_price, image_url) VALUES
('Tech Conference 2026', 'Annual software engineering & AI innovation summit.', 'Silicon Convention Center, CA', '2026-09-15', '09:00:00', 500, 498, 1500.00, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
('Music Night 2026', 'Live symphony orchestra and modern acoustic performance.', 'Grand City Hall, NY', '2026-09-20', '19:30:00', 300, 300, 800.00, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'),
('Movie Premiere: Quantum Paradox', 'Exclusive IMAX 3D red carpet movie premiere.', 'AMC Lincoln Square, NY', '2026-08-25', '18:00:00', 200, 195, 450.00, 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'),
('Stand-Up Comedy Night', 'An evening of non-stop laughter featuring top comedians.', 'The Comedy Club, LA', '2026-09-05', '20:00:00', 150, 150, 500.00, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'),
('National Sports Championship', 'Live stadium finals tournament match.', 'National Sports Arena, Chicago', '2026-10-10', '16:00:00', 1000, 990, 1200.00, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800');

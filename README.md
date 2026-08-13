# Simple Ticket Booking System

A clean, full-featured academic and production-ready **Simple Ticket Booking System** built with **Java 17**, **Spring Boot 3**, **Supabase PostgreSQL**, REST APIs, and a responsive **HTML/CSS/JavaScript** frontend.

---

## 🌟 Key Features

- **User Authentication**: Secure registration, login, and JWT-based authentication.
- **Event Catalog**: Browse upcoming tech conferences, concerts, movie premieres, comedy shows, and sports events with live search and seat tracking.
- **Atomic Seat Reservation**: PostgreSQL-backed atomic seat reservation preventing race conditions and overbooking.
- **Booking Reference Generator**: Human-readable booking reference IDs (e.g. `TB-2026-A1B2C3`).
- **My Bookings & Cancellation**: View booking history, download confirmation receipts, and cancel bookings with automatic seat restoration.
- **Admin Dashboard**: Analytics metrics (Total Events, Users, Bookings, Tickets Sold, Revenue), Event CRUD, and filterable Booking Management.
- **RESTful Architecture**: Clean DTOs, `@RestControllerAdvice` error responses, and Swagger OpenAPI documentation.

---

## 🛠️ Technology Stack

- **Backend**: Java 17, Spring Boot 3.2.4, Spring Security 6, Spring Data JPA, Hibernate, JWT (`jjwt`), Lombok, Maven.
- **Database**: Supabase PostgreSQL.
- **Frontend**: HTML5, Vanilla CSS3 (Porcelain White design system, Syne & Plus Jakarta Sans typography), JavaScript (ES6 fetch API).
- **API Documentation**: SpringDoc OpenAPI / Swagger UI.

---

## 📁 Project Structure

```text
ticket-booking/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/ticketbooking/
│   │   │       ├── controller/        # Auth, Event, Booking, Admin REST Controllers
│   │   │       ├── service/           # Core business logic & atomic seat handling
│   │   │       ├── repository/        # Spring Data JPA repositories
│   │   │       ├── model/             # User, Event, Booking Entities & Enums
│   │   │       ├── dto/               # Request & Response DTOs
│   │   │       ├── security/          # JWT Token Provider, Filters & Spring Security
│   │   │       ├── exception/         # Centralized @RestControllerAdvice exception handlers
│   │   │       └── TicketBookingApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/                # Single-page HTML/CSS/JS Frontend
│   │           ├── index.html
│   │           ├── css/style.css
│   │           └── js/app.js
│   └── test/
│       └── java/com/example/ticketbooking/TicketBookingApplicationTests.java
├── supabase/
│   ├── schema.sql                     # Full DDL, Indexes, Atomic RPC function & sample data
│   └── README.md
├── .env.example
├── .gitignore
├── pom.xml
└── README.md
```

---

## 🚀 Quick Setup & Installation

### 1. Database Setup (Supabase)
1. Log in to [Supabase](https://supabase.com/).
2. Open the **SQL Editor** and execute [`supabase/schema.sql`](./supabase/schema.sql).
3. Retrieve your PostgreSQL connection string and API keys from **Project Settings**.

### 2. Configure Environment Credentials
Copy `.env.example` to `.env`:
```properties
SUPABASE_URL=https://rsvzwjfjnsktpkgsbadd.supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
DATABASE_URL=jdbc:postgresql://db.rsvzwjfjnsktpkgsbadd.supabase.co:5432/postgres?sslmode=require
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=[YOUR_DB_PASSWORD]
```

### 3. Build & Run Application
Execute using Maven:
```bash
# Build and run unit tests
./mvnw clean test

# Run application locally
./mvnw spring-boot:run
```

Open your browser and navigate to:
- **Web App**: [http://localhost:8080](http://localhost:8080)
- **Swagger API Docs**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 🔑 Pre-Configured Test Accounts

- **Admin Account**: `admin@example.com` / `password123`
- **Standard User**: `user@example.com` / `password123`

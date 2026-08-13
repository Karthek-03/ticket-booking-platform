const API_BASE = '/api';
let currentUser = JSON.parse(localStorage.getItem('ticket_user') || 'null');
let currentToken = localStorage.getItem('ticket_token') || null;
let allEventsCache = [];
let selectedEventForBooking = null;
let bookingQuantity = 1;

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadEvents();
});

// View Navigation
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    if (viewId === 'eventsView') loadEvents();
    if (viewId === 'myBookingsView') loadMyBookings();
    if (viewId === 'adminView') loadAdminDashboard();
}

// Modal Helpers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// Auth UI State
function updateAuthUI() {
    const loginBtn = document.getElementById('loginNavBtn');
    const regBtn = document.getElementById('registerNavBtn');
    const logoutBtn = document.getElementById('logoutNavBtn');
    const greeting = document.getElementById('userGreeting');

    const userOnlyElements = document.querySelectorAll('.user-only');
    const adminOnlyElements = document.querySelectorAll('.admin-only');

    if (currentUser && currentToken) {
        loginBtn.style.display = 'none';
        regBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-flex';
        greeting.style.display = 'inline-block';
        greeting.textContent = `Hello, ${currentUser.name}`;

        userOnlyElements.forEach(el => el.style.display = 'inline-block');

        if (currentUser.role === 'ADMIN') {
            adminOnlyElements.forEach(el => el.style.display = 'inline-block');
        } else {
            adminOnlyElements.forEach(el => el.style.display = 'none');
        }
    } else {
        loginBtn.style.display = 'inline-flex';
        regBtn.style.display = 'inline-flex';
        logoutBtn.style.display = 'none';
        greeting.style.display = 'none';

        userOnlyElements.forEach(el => el.style.display = 'none');
        adminOnlyElements.forEach(el => el.style.display = 'none');
    }
}

// API Helper
async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (currentToken) {
        headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'API request failed');
    }
    return data;
}

// Auth Handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await apiCall('/auth/login', 'POST', { email, password });
        currentUser = res.data;
        currentToken = res.data.token;
        localStorage.setItem('ticket_user', JSON.stringify(currentUser));
        localStorage.setItem('ticket_token', currentToken);

        closeModal('loginModal');
        updateAuthUI();
        alert(`Welcome back, ${currentUser.name}!`);
        showView('eventsView');
    } catch (err) {
        alert(err.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await apiCall('/auth/register', 'POST', { name, email, password });
        currentUser = res.data;
        currentToken = res.data.token;
        localStorage.setItem('ticket_user', JSON.stringify(currentUser));
        localStorage.setItem('ticket_token', currentToken);

        closeModal('registerModal');
        updateAuthUI();
        alert('Account created successfully!');
        showView('eventsView');
    } catch (err) {
        alert(err.message);
    }
}

function handleLogout() {
    currentUser = null;
    currentToken = null;
    localStorage.removeItem('ticket_user');
    localStorage.removeItem('ticket_token');
    updateAuthUI();
    showView('homeView');
}

// Events Management
async function loadEvents() {
    try {
        const res = await apiCall('/events');
        allEventsCache = res.data || [];
        renderEvents(allEventsCache);
    } catch (err) {
        console.error('Failed to load events:', err);
    }
}

function renderEvents(events) {
    const featuredGrid = document.getElementById('featuredEventsGrid');
    const allGrid = document.getElementById('allEventsGrid');

    const html = events.map(evt => `
        <div className="event-card">
            <img src="${evt.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}" className="event-card-img" alt="${evt.title}" />
            <div className="event-card-body">
                <h3 className="event-card-title">${evt.title}</h3>
                <div className="event-meta">
                    <div>📍 ${evt.location}</div>
                    <div>📅 ${evt.eventDate} at ${evt.eventTime}</div>
                    <div style="margin-top:0.4rem;">
                        <span className="badge ${evt.availableSeats > 0 ? 'badge-success' : 'badge-danger'}">
                            ${evt.availableSeats > 0 ? `${evt.availableSeats} seats left` : 'Sold Out'}
                        </span>
                    </div>
                </div>
                <div className="event-card-footer">
                    <div className="event-price">₹${evt.ticketPrice}</div>
                    <button className="btn btn-primary btn-sm" 
                        onclick="openBookingModal(${evt.id})" 
                        ${evt.availableSeats <= 0 ? 'disabled' : ''}>
                        ${evt.availableSeats > 0 ? 'Book Ticket' : 'Sold Out'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    if (featuredGrid) featuredGrid.innerHTML = html;
    if (allGrid) allGrid.innerHTML = html;
}

function filterEvents() {
    const q = document.getElementById('eventSearchInput').value.toLowerCase();
    const filtered = allEventsCache.filter(e => 
        e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    );
    renderEvents(filtered);
}

// Booking Modal & Actions
function openBookingModal(eventId) {
    if (!currentUser) {
        alert('Please login or register to book tickets!');
        openModal('loginModal');
        return;
    }

    selectedEventForBooking = allEventsCache.find(e => e.id === eventId);
    if (!selectedEventForBooking) return;

    bookingQuantity = 1;
    document.getElementById('ticketQuantity').textContent = bookingQuantity;
    document.getElementById('bookModalEventTitle').textContent = selectedEventForBooking.title;
    document.getElementById('bookModalEventMeta').textContent = `📍 ${selectedEventForBooking.location} | 📅 ${selectedEventForBooking.eventDate} at ${selectedEventForBooking.eventTime} (${selectedEventForBooking.availableSeats} seats available)`;

    calculateBookingTotal();
    openModal('bookingModal');
}

function updateQuantity(change) {
    if (!selectedEventForBooking) return;
    const newQty = bookingQuantity + change;
    if (newQty >= 1 && newQty <= selectedEventForBooking.availableSeats) {
        bookingQuantity = newQty;
        document.getElementById('ticketQuantity').textContent = bookingQuantity;
        calculateBookingTotal();
    }
}

function calculateBookingTotal() {
    if (!selectedEventForBooking) return;
    const total = selectedEventForBooking.ticketPrice * bookingQuantity;
    document.getElementById('bookingTotalAmount').textContent = `₹${total.toFixed(2)}`;
}

async function submitBooking() {
    if (!selectedEventForBooking) return;

    try {
        const res = await apiCall('/bookings', 'POST', {
            eventId: selectedEventForBooking.id,
            quantity: bookingQuantity
        });

        closeModal('bookingModal');
        loadEvents();

        // Show Confirmation
        const b = res.data;
        document.getElementById('confRef').textContent = b.bookingReference;
        document.getElementById('confEvent').textContent = b.eventTitle;
        document.getElementById('confQty').textContent = b.quantity;
        document.getElementById('confAmount').textContent = `₹${b.totalAmount}`;
        openModal('confirmationModal');
    } catch (err) {
        alert(err.message);
    }
}

// My Bookings
async function loadMyBookings() {
    if (!currentUser) return;
    try {
        const res = await apiCall('/bookings/my');
        const bookings = res.data || [];

        const tbody = document.getElementById('myBookingsTableBody');
        if (!tbody) return;

        if (bookings.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No bookings found. Browse events to book your tickets!</td></tr>`;
            return;
        }

        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td><strong>${b.bookingReference}</strong></td>
                <td>${b.eventTitle}</td>
                <td>${b.eventDate} at ${b.eventTime}</td>
                <td>${b.quantity}</td>
                <td>₹${b.totalAmount}</td>
                <td>
                    <span className="badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}">
                        ${b.bookingStatus}
                    </span>
                </td>
                <td>
                    ${b.bookingStatus === 'CONFIRMED' ? 
                        `<button className="btn btn-danger btn-sm" onclick="cancelBooking(${b.id})">Cancel</button>` : 
                        `<span style="color:var(--text-muted); font-size:0.85rem;">Cancelled</span>`}
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Failed to load my bookings:', err);
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking? Reserved seats will be restored.')) return;
    try {
        await apiCall(`/bookings/${bookingId}/cancel`, 'PUT');
        alert('Booking cancelled successfully!');
        loadMyBookings();
        loadEvents();
    } catch (err) {
        alert(err.message);
    }
}

// Admin Dashboard
async function loadAdminDashboard() {
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Admin access required!');
        showView('homeView');
        return;
    }

    try {
        const metricsRes = await apiCall('/admin/dashboard');
        const m = metricsRes.data;
        document.getElementById('metricEvents').textContent = m.totalEvents;
        document.getElementById('metricUsers').textContent = m.totalUsers;
        document.getElementById('metricBookings').textContent = m.totalBookings;
        document.getElementById('metricTickets').textContent = m.totalTicketsSold;
        document.getElementById('metricRevenue').textContent = `₹${m.totalRevenue || 0}`;

        loadAdminEvents();
        loadAdminBookings(null);
    } catch (err) {
        console.error('Failed to load admin dashboard:', err);
    }
}

async function loadAdminEvents() {
    const res = await apiCall('/events');
    const events = res.data || [];
    const tbody = document.getElementById('adminEventsTableBody');
    if (!tbody) return;

    tbody.innerHTML = events.map(e => `
        <tr>
            <td>#${e.id}</td>
            <td><strong>${e.title}</strong></td>
            <td>${e.location}</td>
            <td>${e.eventDate} at ${e.eventTime}</td>
            <td>${e.totalSeats}</td>
            <td>${e.availableSeats}</td>
            <td>₹${e.ticketPrice}</td>
            <td>
                <button className="btn btn-secondary btn-sm" onclick="openEditEventModal(${e.id})">Edit</button>
                <button className="btn btn-danger btn-sm" onclick="deleteEvent(${e.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function loadAdminBookings(status) {
    const endpoint = status ? `/admin/bookings?status=${status}` : '/admin/bookings';
    const res = await apiCall(endpoint);
    const bookings = res.data || [];
    const tbody = document.getElementById('adminBookingsTableBody');
    if (!tbody) return;

    tbody.innerHTML = bookings.map(b => `
        <tr>
            <td><strong>${b.bookingReference}</strong></td>
            <td>${b.userName} (${b.userEmail})</td>
            <td>${b.eventTitle}</td>
            <td>${b.quantity}</td>
            <td>₹${b.totalAmount}</td>
            <td><span className="badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}">${b.bookingStatus}</span></td>
            <td>${new Date(b.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function openEditEventModal(eventId) {
    const evt = allEventsCache.find(e => e.id === eventId);
    if (!evt) return;

    document.getElementById('eventModalTitle').textContent = 'Edit Event';
    document.getElementById('eventFormId').value = evt.id;
    document.getElementById('eventTitleInput').value = evt.title;
    document.getElementById('eventDescInput').value = evt.description || '';
    document.getElementById('eventLocInput').value = evt.location;
    document.getElementById('eventDateInput').value = evt.eventDate;
    document.getElementById('eventTimeInput').value = evt.eventTime;
    document.getElementById('eventSeatsInput').value = evt.totalSeats;
    document.getElementById('eventPriceInput').value = evt.ticketPrice;
    document.getElementById('eventImageInput').value = evt.imageUrl || '';

    openModal('createEventModal');
}

async function handleSaveEvent(e) {
    e.preventDefault();
    const id = document.getElementById('eventFormId').value;
    const body = {
        title: document.getElementById('eventTitleInput').value,
        description: document.getElementById('eventDescInput').value,
        location: document.getElementById('eventLocInput').value,
        eventDate: document.getElementById('eventDateInput').value,
        eventTime: document.getElementById('eventTimeInput').value,
        totalSeats: parseInt(document.getElementById('eventSeatsInput').value),
        ticketPrice: parseFloat(document.getElementById('eventPriceInput').value),
        imageUrl: document.getElementById('eventImageInput').value
    };

    try {
        if (id) {
            await apiCall(`/events/${id}`, 'PUT', body);
            alert('Event updated successfully!');
        } else {
            await apiCall('/events', 'POST', body);
            alert('Event created successfully!');
        }
        closeModal('createEventModal');
        loadAdminDashboard();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
        await apiCall(`/events/${eventId}`, 'DELETE');
        alert('Event deleted successfully!');
        loadAdminDashboard();
    } catch (err) {
        alert(err.message);
    }
}

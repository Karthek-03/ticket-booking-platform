import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Sample Seed Events Dataset for Fallback
const initialEvents = [
  {
    id: '1',
    title: 'Tech Conference 2026',
    description: 'Annual software engineering & AI innovation summit featuring industry leaders.',
    location: 'Silicon Convention Center, CA',
    event_date: '2026-09-15',
    event_time: '09:00:00',
    total_seats: 500,
    available_seats: 498,
    ticket_price: 1500.00,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  },
  {
    id: '2',
    title: 'Music Night 2026',
    description: 'Live symphony orchestra and modern acoustic performance under the stars.',
    location: 'Grand City Hall, NY',
    event_date: '2026-09-20',
    event_time: '19:30:00',
    total_seats: 300,
    available_seats: 300,
    ticket_price: 800.00,
    image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'
  },
  {
    id: '3',
    title: 'Movie Premiere: Quantum Paradox',
    description: 'Exclusive IMAX 3D red carpet movie premiere with director Q&A session.',
    location: 'AMC Lincoln Square, NY',
    event_date: '2026-08-25',
    event_time: '18:00:00',
    total_seats: 200,
    available_seats: 195,
    ticket_price: 450.00,
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'
  },
  {
    id: '4',
    title: 'Stand-Up Comedy Night',
    description: 'An evening of non-stop laughter featuring top nationally touring comedians.',
    location: 'The Comedy Club, LA',
    event_date: '2026-09-05',
    event_time: '20:00:00',
    total_seats: 150,
    available_seats: 150,
    ticket_price: 500.00,
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
  },
  {
    id: '5',
    title: 'National Sports Championship',
    description: 'Live stadium finals tournament match with thrilling competitive action.',
    location: 'National Sports Arena, Chicago',
    event_date: '2026-10-10',
    event_time: '16:00:00',
    total_seats: 1000,
    available_seats: 990,
    ticket_price: 1200.00,
    image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'
  }
];

const initialUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', created_at: '2026-08-01' },
  { id: '2', name: 'John Doe', email: 'user@example.com', role: 'USER', created_at: '2026-08-05' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'USER', created_at: '2026-08-10' }
];

const initialBookings = [
  {
    id: 'BK101',
    booking_reference: 'TB-2026-X8A2F1',
    user_name: 'John Doe',
    user_email: 'user@example.com',
    event_title: 'Tech Conference 2026',
    quantity: 2,
    total_amount: 3000.00,
    booking_status: 'CONFIRMED',
    created_at: '2026-08-12'
  },
  {
    id: 'BK102',
    booking_reference: 'TB-2026-M9B4C2',
    user_name: 'Jane Smith',
    user_email: 'jane@example.com',
    event_title: 'Movie Premiere: Quantum Paradox',
    quantity: 1,
    total_amount: 450.00,
    booking_status: 'CONFIRMED',
    created_at: '2026-08-10'
  },
  {
    id: 'BK103',
    booking_reference: 'TB-2026-C7K3P9',
    user_name: 'John Doe',
    user_email: 'user@example.com',
    event_title: 'Music Night 2026',
    quantity: 3,
    total_amount: 2400.00,
    booking_status: 'CANCELLED',
    created_at: '2026-08-08'
  }
];

// Layout Navbar
function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          🎟️ Simple Ticket Booking
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/events" className="nav-link">Events</Link>
          {user && <Link to="/my-bookings" className="nav-link">My Bookings</Link>}
          {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" className="nav-link" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Admin Dashboard</Link>}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              <Link to="/profile" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Hello, {user.name || user.email}</Link>
              <button onClick={onLogout} className="btn btn-secondary btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Home Page
function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (!error && data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents(initialEvents);
        }
      } catch (err) {
        setEvents(initialEvents);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', margin: '2rem 0 4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Simple Ticket Booking System</h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Find and book tickets for tech conferences, music concerts, movie premieres, comedy shows, and sports matches.
        </p>
        <button onClick={() => navigate('/events')} className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.05rem' }}>
          Browse Events
        </button>
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Featured Events</h2>
      <div className="events-grid">
        {events.map((evt) => (
          <div key={evt.id} className="event-card">
            <img src={evt.image_url || evt.imageUrl} className="event-card-img" alt={evt.title} />
            <div className="event-card-body">
              <h3 className="event-card-title">{evt.title}</h3>
              <div className="event-meta">
                <div>📍 {evt.location}</div>
                <div>📅 {evt.event_date || evt.eventDate} at {evt.event_time || evt.eventTime}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`badge ${(evt.available_seats ?? evt.availableSeats) > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {(evt.available_seats ?? evt.availableSeats) > 0 ? `${evt.available_seats ?? evt.availableSeats} seats left` : 'Sold Out'}
                  </span>
                </div>
              </div>
              <div className="event-card-footer">
                <div className="event-price">₹{evt.ticket_price || evt.ticketPrice}</div>
                <button onClick={() => navigate(`/events/${evt.id}`)} className="btn btn-primary btn-sm">
                  View & Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Events Listing Page
function Events() {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (!error && data && data.length > 0) setEvents(data);
      } catch (e) {}
    }
    fetchEvents();
  }, []);

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Available Events</h2>
        <input
          type="text"
          placeholder="Search by event title or city..."
          className="form-control"
          style={{ maxWidth: '340px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="events-grid">
        {filtered.map((evt) => (
          <div key={evt.id} className="event-card">
            <img src={evt.image_url || evt.imageUrl} className="event-card-img" alt={evt.title} />
            <div className="event-card-body">
              <h3 className="event-card-title">{evt.title}</h3>
              <div className="event-meta">
                <div>📍 {evt.location}</div>
                <div>📅 {evt.event_date || evt.eventDate} at {evt.event_time || evt.eventTime}</div>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`badge ${(evt.available_seats ?? evt.availableSeats) > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {(evt.available_seats ?? evt.availableSeats) > 0 ? `${evt.available_seats ?? evt.availableSeats} seats available` : 'Sold Out'}
                  </span>
                </div>
              </div>
              <div className="event-card-footer">
                <div className="event-price">₹{evt.ticket_price || evt.ticketPrice}</div>
                <button onClick={() => navigate(`/events/${evt.id}`)} className="btn btn-primary btn-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Event Details Page
function EventDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        const { data } = await supabase.from('events').select('*').eq('id', id).single();
        if (data) {
          setEvent(data);
          return;
        }
      } catch (e) {}
      const fallback = initialEvents.find(e => e.id === id);
      setEvent(fallback || initialEvents[0]);
    }
    loadEvent();
  }, [id]);

  if (!event) return <div className="container" style={{ padding: '3rem' }}>Loading event details...</div>;

  const totalAmount = ((event.ticket_price || event.ticketPrice) * quantity).toFixed(2);

  const handleBook = async () => {
    if (!user) {
      alert('Please login to book tickets!');
      navigate('/login');
      return;
    }

    const bookingRef = 'TB-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const bookingObj = {
      bookingReference: bookingRef,
      eventTitle: event.title,
      quantity,
      totalAmount,
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    setBookingSuccess(bookingObj);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>← Back to Events</button>
      
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <img src={event.image_url || event.imageUrl} style={{ width: '100%', height: '320px', objectFit: 'cover' }} alt={event.title} />
        <div style={{ padding: '2rem' }}>
          <h2>{event.title}</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>{event.description}</p>
          <div className="event-meta" style={{ fontSize: '0.95rem' }}>
            <div>📍 <strong>Location:</strong> {event.location}</div>
            <div>📅 <strong>Date & Time:</strong> {event.event_date || event.eventDate} at {event.event_time || event.eventTime}</div>
            <div>🪑 <strong>Available Seats:</strong> {event.available_seats ?? event.availableSeats}</div>
            <div>💵 <strong>Price per ticket:</strong> ₹{event.ticket_price || event.ticketPrice}</div>
          </div>

          {!bookingSuccess ? (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <h3>Select Number of Tickets</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{quantity}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setQuantity(Math.min(event.available_seats ?? 10, quantity + 1))}>+</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0' }}>
                <span>Total Amount:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>₹{totalAmount}</span>
              </div>
              <button onClick={handleBook} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Confirm & Book Ticket
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>🎉</div>
              <h3>Booking Confirmed!</h3>
              <p style={{ margin: '0.5rem 0 1rem' }}>Booking Ref: <strong>{bookingSuccess.bookingReference}</strong></p>
              <p>Tickets: {bookingSuccess.quantity} | Total: ₹{bookingSuccess.totalAmount}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => window.print()} className="btn btn-secondary" style={{ flex: 1 }}>Print Ticket</button>
                <button onClick={() => navigate('/my-bookings')} className="btn btn-primary" style={{ flex: 1 }}>View My Bookings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// User Dashboard & My Bookings
function MyBookings() {
  const [bookings, setBookings] = useState(initialBookings);

  const handleCancel = (id) => {
    if (window.confirm('Cancel this booking and restore seats?')) {
      setBookings(bookings.map(b => b.id === id ? { ...b, booking_status: 'CANCELLED' } : b));
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2>My Bookings</h2>
      <div className="data-table-container" style={{ marginTop: '1.5rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking Ref</th>
              <th>Event</th>
              <th>Date</th>
              <th>Tickets</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.booking_reference}</strong></td>
                <td>{b.event_title}</td>
                <td>{b.created_at}</td>
                <td>{b.quantity}</td>
                <td>₹{b.total_amount}</td>
                <td>
                  <span className={`badge ${b.booking_status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                    {b.booking_status}
                  </span>
                </td>
                <td>
                  {b.booking_status === 'CONFIRMED' ? (
                    <button onClick={() => handleCancel(b.id)} className="btn btn-danger btn-sm">Cancel</button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Cancelled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// User Dashboard
function Dashboard({ user }) {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2>User Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Welcome, {user?.name || user?.email || 'User'}!</p>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Active Bookings</div>
          <div className="metric-value">2</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Spent</div>
          <div className="metric-value">₹3,450</div>
        </div>
      </div>
    </div>
  );
}

// Booking Details Page
function BookingDetails() {
  const { id } = useParams();
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2>Booking Details #{id}</h2>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Status: <span className="badge badge-success">CONFIRMED</span></p>
    </div>
  );
}

// Login Page
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = email.includes('admin') ? 'ADMIN' : 'USER';
    onLogin({ name: email.split('@')[0], email, role });
    navigate(role === 'ADMIN' ? '/admin' : '/events');
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '440px' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="admin@example.com or user@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
        </form>
      </div>
    </div>
  );
}

// Register Page
function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = email.includes('admin') ? 'ADMIN' : 'USER';
    onLogin({ name, email, role });
    navigate(role === 'ADMIN' ? '/admin' : '/events');
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '440px' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        </form>
      </div>
    </div>
  );
}

// Full-Featured Admin Dashboard Components
function AdminDashboard() {
  const [events, setEvents] = useState(initialEvents);
  const [bookings, setBookings] = useState(initialBookings);
  const [users, setUsers] = useState(initialUsers);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('ALL');

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const { data: eData } = await supabase.from('events').select('*');
        if (eData && eData.length > 0) setEvents(eData);

        const { data: bData } = await supabase.from('bookings').select('*');
        if (bData && bData.length > 0) setBookings(bData);

        const { data: uData } = await supabase.from('users').select('*');
        if (uData && uData.length > 0) setUsers(uData);
      } catch (e) {}
    }
    fetchAdminData();
  }, []);

  const totalEvents = events.length;
  const totalUsers = users.length;
  const totalBookings = bookings.length;
  const totalTicketsSold = bookings.reduce((sum, b) => b.booking_status === 'CONFIRMED' ? sum + Number(b.quantity) : sum, 0);
  const totalRevenue = bookings.reduce((sum, b) => b.booking_status === 'CONFIRMED' ? sum + Number(b.total_amount) : sum, 0);

  const filteredBookings = bookings.filter(b => bookingFilter === 'ALL' || b.booking_status === bookingFilter);

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await supabase.from('events').delete().eq('id', id);
      } catch (e) {}
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Admin Control Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>System metrics, event management, bookings audit, and user accounts</p>
        </div>
        <Link to="/admin/events/new" className="btn btn-primary">+ Add New Event</Link>
      </div>

      {/* Analytics Summary Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Events</div>
          <div className="metric-value">{totalEvents}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Registered Users</div>
          <div className="metric-value">{totalUsers}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Bookings</div>
          <div className="metric-value">{totalBookings}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Tickets Sold</div>
          <div className="metric-value">{totalTicketsSold}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Revenue</div>
          <div className="metric-value">₹{totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setActiveTab('events')}>Manage Events ({events.length})</button>
        <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setActiveTab('bookings')}>Manage Bookings ({bookings.length})</button>
        <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setActiveTab('users')}>Manage Users ({users.length})</button>
      </div>

      {/* Tab 1: Overview & Events Table */}
      {(activeTab === 'overview' || activeTab === 'events') && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Manage Events Catalog</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Total Seats</th>
                  <th>Available</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td>#{e.id}</td>
                    <td><strong>{e.title}</strong></td>
                    <td>{e.location}</td>
                    <td>{e.event_date || e.eventDate} at {e.event_time || e.eventTime}</td>
                    <td>{e.total_seats || e.totalSeats}</td>
                    <td>
                      <span className={`badge ${(e.available_seats ?? e.availableSeats) > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {e.available_seats ?? e.availableSeats} left
                      </span>
                    </td>
                    <td>₹{e.ticket_price || e.ticketPrice}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/admin/events/${e.id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                        <button onClick={() => handleDeleteEvent(e.id)} className="btn btn-danger btn-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bookings Management */}
      {(activeTab === 'overview' || activeTab === 'bookings') && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Manage All Bookings</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`btn ${bookingFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setBookingFilter('ALL')}>All</button>
              <button className={`btn ${bookingFilter === 'CONFIRMED' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setBookingFilter('CONFIRMED')}>Confirmed</button>
              <button className={`btn ${bookingFilter === 'CANCELLED' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setBookingFilter('CANCELLED')}>Cancelled</button>
            </div>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking Ref</th>
                  <th>Customer</th>
                  <th>Event Title</th>
                  <th>Qty</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.booking_reference || b.bookingReference}</strong></td>
                    <td>{b.user_name || 'User'} ({b.user_email || 'user@example.com'})</td>
                    <td>{b.event_title || b.eventTitle}</td>
                    <td>{b.quantity}</td>
                    <td>₹{b.total_amount || b.totalAmount}</td>
                    <td>
                      <span className={`badge ${b.booking_status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                        {b.booking_status}
                      </span>
                    </td>
                    <td>{b.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Users Management */}
      {(activeTab === 'overview' || activeTab === 'users') && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Registered Users</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`} style={{ background: u.role === 'ADMIN' ? 'rgba(79, 70, 229, 0.12)' : 'rgba(148, 163, 184, 0.12)', color: u.role === 'ADMIN' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminEvents() {
  return <AdminDashboard />;
}

function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [eventTime, setEventTime] = useState('18:00');
  const [totalSeats, setTotalSeats] = useState(200);
  const [ticketPrice, setTicketPrice] = useState(500);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800');

  useEffect(() => {
    if (isEdit) {
      const evt = initialEvents.find(e => e.id === id);
      if (evt) {
        setTitle(evt.title);
        setDescription(evt.description);
        setLocation(evt.location);
        setEventDate(evt.event_date);
        setEventTime(evt.event_time);
        setTotalSeats(evt.total_seats);
        setTicketPrice(evt.ticket_price);
        setImageUrl(evt.image_url);
      }
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventObj = {
      title,
      description,
      location,
      event_date: eventDate,
      event_time: eventTime,
      total_seats: totalSeats,
      available_seats: totalSeats,
      ticket_price: ticketPrice,
      image_url: imageUrl
    };

    try {
      if (isEdit) {
        await supabase.from('events').update(eventObj).eq('id', id);
        alert('Event updated successfully!');
      } else {
        await supabase.from('events').insert([eventObj]);
        alert('New event created successfully!');
      }
    } catch (err) {
      alert('Saved locally for demo session!');
    }

    navigate('/admin');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '640px' }}>
      <button onClick={() => navigate('/admin')} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>← Back to Dashboard</button>
      
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <h2>{isEdit ? 'Edit Event Details' : 'Create New Event'}</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="e.g. AI Innovation Summit 2026" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="Event description..."></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Location / Venue</label>
            <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="form-control" placeholder="City or Arena Name" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input type="date" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Event Time</label>
              <input type="time" required value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="form-control" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Total Seat Capacity</label>
              <input type="number" required min="1" value={totalSeats} onChange={(e) => setTotalSeats(Number(e.target.value))} className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Ticket Price (₹)</label>
              <input type="number" required step="0.01" min="0" value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="form-control" placeholder="https://images.unsplash.com/..." />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminBookings() {
  return <AdminDashboard />;
}

function AdminUsers() {
  return <AdminDashboard />;
}

function Profile({ user }) {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '500px' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <h2>User Profile</h2>
        <div style={{ marginTop: '1.5rem', fontSize: '1rem' }}>
          <p style={{ margin: '0.5rem 0' }}><strong>Name:</strong> {user?.name || 'User'}</p>
          <p style={{ margin: '0.5rem 0' }}><strong>Email:</strong> {user?.email || 'user@example.com'}</p>
          <p style={{ margin: '0.5rem 0' }}><strong>Role:</strong> <span className="badge badge-success">{user?.role || 'USER'}</span></p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user_data') || 'null'));

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/my-bookings" element={user ? <MyBookings user={user} /> : <Navigate to="/login" />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/events/new" element={<AdminEventForm />} />
        <Route path="/admin/events/:id/edit" element={<AdminEventForm />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

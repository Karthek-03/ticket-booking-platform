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
          {user?.role === 'ADMIN' && <Link to="/admin" className="nav-link" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Admin</Link>}
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
                  <span className={`badge ${evt.available_seats > 0 || evt.availableSeats > 0 ? 'badge-success' : 'badge-danger'}`}>
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
        const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
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
function MyBookings({ user }) {
  const sampleBookings = [
    {
      id: 'BK101',
      bookingReference: 'TB-2026-X8A2F1',
      eventTitle: 'Tech Conference 2026',
      eventDate: '2026-09-15',
      quantity: 2,
      totalAmount: '3000.00',
      bookingStatus: 'CONFIRMED',
      createdAt: '2026-08-12'
    },
    {
      id: 'BK102',
      bookingReference: 'TB-2026-M9B4C2',
      eventTitle: 'Movie Premiere: Quantum Paradox',
      eventDate: '2026-08-25',
      quantity: 1,
      totalAmount: '450.00',
      bookingStatus: 'CONFIRMED',
      createdAt: '2026-08-10'
    }
  ];

  const [bookings, setBookings] = useState(sampleBookings);

  const handleCancel = (id) => {
    if (window.confirm('Cancel this booking and restore seats?')) {
      setBookings(bookings.map(b => b.id === id ? { ...b, bookingStatus: 'CANCELLED' } : b));
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
                <td><strong>{b.bookingReference}</strong></td>
                <td>{b.eventTitle}</td>
                <td>{b.eventDate}</td>
                <td>{b.quantity}</td>
                <td>₹{b.totalAmount}</td>
                <td>
                  <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`}>
                    {b.bookingStatus}
                  </span>
                </td>
                <td>
                  {b.bookingStatus === 'CONFIRMED' ? (
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
    navigate('/events');
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '440px' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="user@example.com" />
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
    onLogin({ name, email, role: 'USER' });
    navigate('/events');
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

// Admin Pages
function AdminDashboard() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2>Admin Dashboard</h2>
      <div className="metrics-grid" style={{ marginTop: '2rem' }}>
        <div className="metric-card"><div className="metric-label">Total Events</div><div className="metric-value">5</div></div>
        <div className="metric-card"><div className="metric-label">Total Users</div><div className="metric-value">12</div></div>
        <div className="metric-card"><div className="metric-label">Total Bookings</div><div className="metric-value">28</div></div>
        <div className="metric-card"><div className="metric-label">Tickets Sold</div><div className="metric-value">45</div></div>
        <div className="metric-card"><div className="metric-label">Total Revenue</div><div className="metric-value">₹42,500</div></div>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/admin/events" className="btn btn-primary">Manage Events</Link>
        <Link to="/admin/bookings" className="btn btn-secondary">Manage Bookings</Link>
        <Link to="/admin/users" className="btn btn-secondary">Manage Users</Link>
      </div>
    </div>
  );
}

function AdminEvents() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Manage Events</h2>
        <Link to="/admin/events/new" className="btn btn-primary">+ Create Event</Link>
      </div>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Location</th><th>Price</th><th>Seats Left</th></tr>
          </thead>
          <tbody>
            {initialEvents.map(e => (
              <tr key={e.id}><td>#{e.id}</td><td>{e.title}</td><td>{e.location}</td><td>₹{e.ticket_price}</td><td>{e.available_seats}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminEventForm() {
  const navigate = useNavigate();
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '600px' }}>
      <h2>Event Form</h2>
      <form onSubmit={(e) => { e.preventDefault(); alert('Saved!'); navigate('/admin/events'); }}>
        <div className="form-group"><label className="form-label">Title</label><input required className="form-control" /></div>
        <div className="form-group"><label className="form-label">Location</label><input required className="form-control" /></div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

function AdminBookings() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2>Admin Bookings</h2>
    </div>
  );
}

function AdminUsers() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2>Admin Users</h2>
    </div>
  );
}

function Profile({ user }) {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h2>User Profile</h2>
      <p style={{ marginTop: '1rem' }}>Name: {user?.name || 'User'}</p>
      <p>Email: {user?.email || 'user@example.com'}</p>
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

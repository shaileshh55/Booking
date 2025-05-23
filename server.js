const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Ensure files exist
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify({}, null, 2));
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({
  "admin": { "password": "admin123", "isAdmin": true },
  "student1": { "password": "student1", "name": "John Doe", "isAdmin": false },
  "student2": { "password": "student2", "name": "Jane Smith", "isAdmin": false },
  "23202001@rmd.ac.in": { "password": "111523202003", "name": "ANEESH V", "isAdmin": false },
  "23202009@rmd.ac.in": { "password": "111523202009", "name": "BOMMISETTY M V S S S HRITHIK", "isAdmin": false },
  "23202010@rmd.ac.in": { "password": "111523202010", "name": "CHARAN K", "isAdmin": false },
  "23202011@rmd.ac.in": { "password": "111523202011", "name": "DHARSHAN KUMAR S", "isAdmin": false },
  "23202013@rmd.ac.in": { "password": "111523202013", "name": "FREDRICK OLIVER R", "isAdmin": false },
  "23202015@rmd.ac.in": { "password": "111523202015", "name": "GOLLAPALLI AMAR VENKAT SRI KRISHNAM RAJ", "isAdmin": false },
  "23202016@rmd.ac.in": { "password": "111523202016", "name": "GOWTHAM E", "isAdmin": false },
  "23202017@rmd.ac.in": { "password": "111523202017", "name": "GOWTHAM K", "isAdmin": false },
  "23202018@rmd.ac.in": { "password": "111523202018", "name": "HARI RAM C", "isAdmin": false },
  "23202022@rmd.ac.in": { "password": "111523202022", "name": "JEEVAN SRESANTH S", "isAdmin": false },
  "23202023@rmd.ac.in": { "password": "111523202023", "name": "JUVVI SIVANNARAYANA", "isAdmin": false },
  "23202025@rmd.ac.in": { "password": "111523202025", "name": "KICCHIPATI MOKSHITH REDDY", "isAdmin": false },
  "23202026@rmd.ac.in": { "password": "111523202026", "name": "LOHITH KUMAR M", "isAdmin": false },
  "23202027@rmd.ac.in": { "password": "111523202027", "name": "LOKESWARAN S", "isAdmin": false },
  "23202029@rmd.ac.in": { "password": "111523202029", "name": "MOHAMED MUZAMMIL M I", "isAdmin": false },
  "23202030@rmd.ac.in": { "password": "111523202030", "name": "MONISHKUMAR R", "isAdmin": false },
  "23202032@rmd.ac.in": { "password": "111523202032", "name": "PERUGU ANISH CHOWDARY", "isAdmin": false },
  "23202033@rmd.ac.in": { "password": "111523202033", "name": "PRAVEEN KUMAR R", "isAdmin": false },
  "23202035@rmd.ac.in": { "password": "111523202035", "name": "PRIVIN PRINCE", "isAdmin": false },
  "23202036@rmd.ac.in": { "password": "111523202036", "name": "PULLA HARSHAVARDHAN", "isAdmin": false },
  "23202037@rmd.ac.in": { "password": "111523202037", "name": "RAVINDHAR G", "isAdmin": false },
  "23202038@rmd.ac.in": { "password": "111523202038", "name": "ROHIT S V", "isAdmin": false },
  "23202039@rmd.ac.in": { "password": "111523202039", "name": "SACHIN D", "isAdmin": false },
  "23202040@rmd.ac.in": { "password": "111523202040", "name": "SANDEEP KAUSHIK R", "isAdmin": false },
  "23202042@rmd.ac.in": { "password": "111523202042", "name": "SANTHOSH PANDIYAN R", "isAdmin": false },
  "23202044@rmd.ac.in": { "password": "111523202044", "name": "SARAVANAKUMAR C", "isAdmin": false },
  "23202045@rmd.ac.in": { "password": "111523202045", "name": "SHAILESHH C", "isAdmin": true },
  "23202046@rmd.ac.in": { "password": "111523202046", "name": "SHIVARAMAKRISHNAAN B", "isAdmin": false },
  "23202047@rmd.ac.in": { "password": "111523202047", "name": "SIVAKUMAR M", "isAdmin": false },
  "23202048@rmd.ac.in": { "password": "111523202048", "name": "SREEJAY V", "isAdmin": false },
  "23202051@rmd.ac.in": { "password": "111523202051", "name": "SRIRANGAM VENKATA PADMA LAKSHMAN", "isAdmin": false },
  "23202055@rmd.ac.in": { "password": "111523202055", "name": "VIROCHAN V", "isAdmin": false },
  "23202056@rmd.ac.in": { "password": "111523202056", "name": "VISWA V", "isAdmin": false },
  "23202057@rmd.ac.in": { "password": "111523202057", "name": "LOGESH B", "isAdmin": false },
  "23202058@rmd.ac.in": { "password": "111523202058", "name": "PRAGADESH T", "isAdmin": false },
  "23202061@rmd.ac.in": { "password": "111523202061", "name": "HEMAKUMAR S", "isAdmin": false },
  "23202062@rmd.ac.in": { "password": "111523202062", "name": "SANJAY ADITYA", "isAdmin": false },
  "23202063@rmd.ac.in": { "password": "111523202063", "name": "KARTHIKEYAN R", "isAdmin": false }
}
, null, 2));
}


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static(__dirname));

// Set up session
app.use(session({
  secret: 'seat-booking-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 } // 1 hour
}));

// Authentication middleware
const authenticate = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

// Admin middleware
const adminOnly = (req, res, next) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  
  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create session
  req.session.user = {
    username,
    name: users[username].name,
    isAdmin: users[username].isAdmin
  };
  
  res.json({ 
    message: 'Login successful',
    user: {
      username,
      name: users[username].name,
      isAdmin: users[username].isAdmin
    }
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// Get current user
app.get('/api/current-user', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

// Endpoint to get bookings
app.get('/api/bookings', (req, res) => {
  try {
    const data = fs.existsSync(BOOKINGS_FILE)
      ? JSON.parse(fs.readFileSync(BOOKINGS_FILE))
      : {};
    res.json(data);
  } catch (err) {
    console.error('Error reading bookings:', err);
    res.status(500).json({ message: 'Error reading bookings data' });
  }
});

// Endpoint to book a seat
app.post('/api/book', authenticate, (req, res) => {
  try {
    const { bench, seat } = req.body;
    const seatId = `bench${bench}_seat${seat}`;

    const bookings = fs.existsSync(BOOKINGS_FILE)
      ? JSON.parse(fs.readFileSync(BOOKINGS_FILE))
      : {};

    if (bookings[seatId] && bookings[seatId].username) {
      return res.status(400).json({ message: 'Seat already booked' });
    }

    // Check if user already has a booking
    const userBookings = Object.entries(bookings).filter(
      ([_, booking]) => booking.username === req.session.user.username
    );
    
    if (userBookings.length > 0 && !req.session.user.isAdmin) {
      return res.status(400).json({ 
        message: 'You already have a seat booked. Cancel it first to book another.'
      });
    }

    // Save booking with user information
    bookings[seatId] = {
      username: req.session.user.username,
      name: req.session.user.name,
      bookedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    res.status(200).json({ message: 'Seat booked successfully' });
  } catch (err) {
    console.error('Error booking seat:', err);
    res.status(500).json({ message: 'Server error while booking seat' });
  }
});

// Endpoint to cancel a booking
app.post('/api/cancel', authenticate, (req, res) => {
  try {
    const { bench, seat } = req.body;
    const seatId = `bench${bench}_seat${seat}`;

    const bookings = fs.existsSync(BOOKINGS_FILE)
      ? JSON.parse(fs.readFileSync(BOOKINGS_FILE))
      : {};

    if (!bookings[seatId]) {
      return res.status(400).json({ message: 'Seat is not booked' });
    }

    // Check if the user is the one who booked it or is an admin
    if (bookings[seatId].username !== req.session.user.username && !req.session.user.isAdmin) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }

    delete bookings[seatId];
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
});

// Admin endpoint to get all users
app.get('/api/users', adminOnly, (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    // Remove passwords before sending
    const safeUsers = Object.entries(users).reduce((acc, [username, data]) => {
      acc[username] = {
        name: data.name,
        isAdmin: data.isAdmin
      };
      return acc;
    }, {});
    
    res.json(safeUsers);
  } catch (err) {
    console.error('Error reading users:', err);
    res.status(500).json({ message: 'Error reading user data' });
  }
});

// Endpoint to reset all bookings (admin only)
app.post('/api/reset-bookings', adminOnly, (req, res) => {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify({}, null, 2));
    res.json({ message: 'All bookings have been reset' });
  } catch (err) {
    console.error('Error resetting bookings:', err);
    res.status(500).json({ message: 'Error resetting bookings' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
const express = require('express');
const bcrypt = require('bcrypt');  // Import bcrypt
const app = express();
const cors = require('cors');
const busRoutes = require('./routes/busRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
require('./config/connect'); // Ensure the database connection file is properly required
const Payment = require('./models/payment');
const Booking = require('./models/booking');
// Models (optional, in case they're needed elsewhere)
const Bus = require('./models/bus');
const User = require('./models/user');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes); // Base URL for booking routes
app.use('/api/buses', busRoutes); // Base URL for bus routes
app.use('/api/users', userRoutes); // Base URL for user routes


app.get('/search_bus', async (req, res) => {
  const { depart, arrive } = req.query;

  try {
    // Validate input
    if (!depart || !arrive) {
      return res.status(400).json({ message: 'Departure and destination locations are required.' });
    }

    // Find buses with matching departure and arrival
    const results = await Bus.find({ depart, arrive });

    if (results.length === 0) {
      return res.status(404).json({ message: 'No buses found for the specified route.' });
    }

    res.json({ results });
  } catch (error) {
    console.error('Error fetching available buses:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
app.post('/createBookingWithPayment', async (req, res) => {
  try {
    const { userId, busNumber, seatNumber, totalPrice, paymentMethod, cardNumber, cardCode } = req.body;

    // Validate input
    if (!userId || !busNumber || !seatNumber || !totalPrice || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find bus by busNumber
    const bus = await Bus.findOne({ busNumber });
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    // Check availability of seats
    if (bus.availableSeats < seatNumber.length) {
      return res.status(400).json({ message: 'Not enough available seats' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Default status based on payment method
    let status = 'confirmed';
    if (paymentMethod === 'cash') {
      status = 'pending'; // Mark cash payments as pending
    }

    // Encrypt card details if payment method is credit card
    let encryptedCardNumber = null;
    let encryptedCardCode = null;

    if (paymentMethod === 'credit_card') {
      const salt = bcrypt.genSaltSync(10);
      encryptedCardNumber = await bcrypt.hash(cardNumber, salt);
      encryptedCardCode = await bcrypt.hash(cardCode, salt);
    }

    // Process payment
    const payment = new Payment({
      amount: totalPrice,
      paymentMethod: paymentMethod,
      status: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      date: new Date(),
    });
    await payment.save();

    // Create the booking
    const booking = new Booking({
      user: user._id,    // Associate booking with the user
      bus: bus._id,      // Link booking to the bus
      seatNumber: seatNumber, // Array of seat numbers
      totalPrice: totalPrice,
      paymentStatus: paymentMethod === 'credit_card' ? 'paid' : 'pending',
      status, // Pending or confirmed
      cardNumber: encryptedCardNumber,
      cardCode: encryptedCardCode,
      date: new Date(),
    });
    await booking.save();

    // Reduce available seats on the bus
    bus.availableSeats -= seatNumber.length;
    await bus.save();

    return res.status(201).json({ message: 'Booking and payment processed successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

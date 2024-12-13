const express = require('express');
const { createBookingWithPayment, getBookings } = require('../controllers/bookingController');
const router = express.Router();

router.post('/book', createBookingWithPayment);  // Create a booking
router.get('/bookings', getBookings); // Get all bookings

module.exports = router;

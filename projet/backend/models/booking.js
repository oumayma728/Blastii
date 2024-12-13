const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  seatNumber: { type: [String], required: true }, // Array of seat numbers
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  date: { type: Date, default: Date.now },

});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
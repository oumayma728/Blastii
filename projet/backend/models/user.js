const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,  // Encrypted
  role: { type: String, default: 'customer' },  // Can also be 'admin'
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  cardNumber: { type: String, required: true }, // New field
  cardCode: { type: String, required: true },  // New field
});

module.exports = mongoose.model('User', userSchema);

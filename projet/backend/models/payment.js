const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed'], // Add 'paid' here as a valid option
    default: 'pending', // Optional: You can set the default to 'pending'
  },
  date: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

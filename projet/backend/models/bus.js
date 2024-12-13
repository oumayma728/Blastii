const mongoose = require('mongoose');
const moment = require('moment');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  depart: { type: String, required: true },
  arrive: { type: String, required: true },
  schedule: {
    type: Date,
    required: true,
    get: function(value) {
      // Using moment.js to format the schedule
      return moment(value).format('YYYY-MM-DD HH:mm');
    }
  }
});

busSchema.pre('save', function (next) {
  if (this.isNew && this.availableSeats === undefined) {
    this.availableSeats = this.seats;
  }
  next();
});

module.exports = mongoose.model('Bus', busSchema);

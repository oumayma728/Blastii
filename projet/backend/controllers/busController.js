const bus = require('../models/bus'); // Assuming you have a Bus model
const mongoose = require('mongoose');
;
// Get available buses by departure and arrival locations
const getAvailableBuses = async (req, res) => {
  try {
    const { depart, arrive } = req.query;

    // Validate input
    if (!depart || !arrive) {
      return res.status(400).json({ message: 'Departure and destination locations are required' });
    }

    const results = await Bus.find({ depart, arrive });
    if (results.length === 0) {
      return res.status(404).json({ message: 'No buses found for the specified route.' });
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching available buses:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a specific bus by ID
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    console.error('Error fetching bus by ID:', error);
    res.status(500).json({ message: 'Error fetching bus', error });
  }
};

// Create a new bus
const createBus = async (req, res) => {
  const data = req.body;

  try {
    // Validate route if provided
    if (data.route && !mongoose.Types.ObjectId.isValid(data.route)) {
      return res.status(400).json({ message: 'Invalid route ID' });
    }

    const newBus = new Bus(data);
    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    console.error('Error creating bus:', error);
    res.status(500).json({ message: 'Error creating bus', error });
  }
};

// Update an existing bus by ID
const updateBus = async (req, res) => {
  try {
    const { seats } = req.body;
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Update seats and adjust available seats if necessary
    if (seats && seats !== bus.seats) {
      const seatDifference = seats - bus.seats;
      bus.availableSeats += seatDifference;
      bus.seats = seats;
    }

    Object.assign(bus, req.body); // Merge new fields with existing
    const updatedBus = await bus.save();
    res.json(updatedBus);
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ message: 'Error updating bus', error });
  }
};

// Delete a bus by ID
const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ message: 'Error deleting bus', error });
  }
};

module.exports = {
  getAvailableBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
};

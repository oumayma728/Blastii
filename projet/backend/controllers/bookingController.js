const Booking = require('../models/booking'); // Assuming you have a Booking model

// Create a booking and process payment
const createBookingWithPayment = async (req, res) => {
    try {
        const { userId, busId, seatNumber, totalPrice, paymentMethod } = req.body;

        // Validate input
        if (!userId || !busId || !seatNumber || !totalPrice || !paymentMethod) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find bus and check availability
        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        if (bus.availableSeats < seatNumber.length) {
            return res.status(400).json({ message: 'Not enough available seats' });
        }

        // Process payment (Assume this is a mock payment logic, integrate with Stripe/PayPal for real payments)
        const payment = new Payment({
            user: userId,
            amount: totalPrice,
            paymentMethod: paymentMethod,
            status: 'paid', // Assume payment is successful, handle failure scenarios in real implementation
            date: new Date(),
        });
        await payment.save();

        // Create the booking
        const booking = new Booking({
            user: userId,
            bus: busId,
            seatNumber: seatNumber,
            totalPrice: totalPrice,
            paymentStatus: 'paid',
            date: new Date(),
        });
        await booking.save();

        // Reduce the number of available seats
        bus.availableSeats -= seatNumber.length;
        await bus.save();

        return res.status(201).json({ message: 'Booking and payment successful', booking });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
// Get all bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user bus'); // Populating user and bus details

        // Respond with the list of bookings
        return res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createBookingWithPayment,
    getBookings
};

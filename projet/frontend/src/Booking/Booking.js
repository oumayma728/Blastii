import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const [formData, setFormData] = useState({
    userId: '',
    busNumber: '',
    seatNumber: '',
    paymentMethod: 'cash',
    cardNumber: '',  
    cardCode: '', 
  });
  const [fixedPrice] = useState(50); // Fixed price for the ticket
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch user data if logged in
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/userData', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData((prevData) => ({
        ...prevData,
        userId: response.data.userId, // Set userId from server
      }));
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Ensure the user is logged in
    if (!isLoggedIn) {
      setMessage('You need to be logged in to book.');
      navigate('/login');
      return;
    }
  
    try {
      const { userId, busNumber, seatNumber, paymentMethod, cardNumber, cardCode } = formData;
      const seatNumbers = seatNumber.split(',').map((seat) => seat.trim()); // Convert to array of seat numbers
  
      if (!userId || !busNumber || seatNumbers.length === 0 || !paymentMethod) {
        setMessage('All fields are required');
        return;
      }
  
      // Validate credit card details if "Credit Card" is selected
      if (paymentMethod === 'credit_card' && (!cardNumber || !cardCode)) {
        setMessage('Credit card details are required.');
        return;
      }
  
      const response = await fetch('http://localhost:5000/createBookingWithPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          busNumber,
          seatNumber: seatNumbers, // Send as an array
          totalPrice: fixedPrice,
          paymentMethod,
          cardNumber: paymentMethod === 'credit_card' ? cardNumber : undefined, // Send cardNumber only for credit card payment
          cardCode: paymentMethod === 'credit_card' ? cardCode : undefined, // Send cardCode only for credit card payment
        }),
      });
  
      const data = await response.json(); // Parse response as JSON
  
      if (response.ok && data.booking) {
        const paymentStatus = paymentMethod === 'cash' ? 'Pending' : 'Confirmed';
        navigate('/ticket', {
          state: {
            ticket: { ...data.booking, paymentStatus }, // Ensure paymentStatus is included
          },
        });
      } else {
        setMessage(data.message || 'Booking failed.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('An error occurred during booking. Please try again.');
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false); // Update state after logout
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Book a Bus Seat</h2>

      {!isLoggedIn && (
        <div>
          <p>You must be logged in to make a booking.</p>
          <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Go to Login
          </button>
        </div>
      )}

      {isLoggedIn && (
        <form onSubmit={handleSubmit}>
          <div>
  <label htmlFor="userId">User Id:</label>
  <input
    type="text"
    id="userId"
    name="userId"
    value={formData.userId}
    onChange={handleChange} // Ensure this is present to handle input changes
  />
</div>

          <div>
            <label htmlFor="busNumber">Bus Number:</label>
            <input
              type="text"
              id="busNumber"
              name="busNumber"
              value={formData.busNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="seatNumber">Seat Number(s):</label>
            <input
              type="text"
              id="seatNumber"
              name="seatNumber"
              value={formData.seatNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <p>
              <strong>Total Price:</strong> ${fixedPrice}
            </p>
          </div>
          <div>
            <label htmlFor="paymentMethod">Payment Method:</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="credit_card">Credit Card</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          {formData.paymentMethod === 'Credit Card' && (
            <div>
              <label htmlFor="cardNumber">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
              <label htmlFor="cardCode">Card Code:</label>
              <input
                type="text"
                id="cardCode"
                name="cardCode"
                value={formData.cardCode}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <button type="submit">Book</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Booking;

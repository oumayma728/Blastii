import React, { useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

function Login() {
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.mytoken); // Save token to localStorage
        localStorage.setItem('userId', data.userId);    // Save userId to localStorage
        alert('Login successful!');
        navigate('../BusSearch'); // Redirect to booking page
      } else {
        setError(data.message || 'Login failed'); // Update error state
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.'); // Update error state
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;

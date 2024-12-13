import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BusSearch from './BusSearch/BusSearch';
import Login from './LogIn/LogIn';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Home/Home';
import Register from './register/Register';
import Booking from './Booking/Booking';
import Ticket from './Booking/ticket';


const App = () => {
  return (
    
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/> 
        <Route path="/BusSearch" element={<BusSearch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reserve/:busId" element={<Booking />} />
        <Route path="/ticket" element={<Ticket />} />

        </Routes>
        <Footer />
        
    </Router>
  );
};

export default App;

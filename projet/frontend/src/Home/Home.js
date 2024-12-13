import React from 'react';
import './Home.css'; // Add custom CSS for styling
import busImage from './logo.png'; // Replace with the actual path to your bus image
import logoImage from './Bus.png'; // Replace with the actual path to your logo image

const Home = () => {
  return (
    <div className="home-container">
      <div className="content">
        <div className="image-container">
          <img src={logoImage} alt="Bus and Ticket" className="bus-image" />
        </div>
        <div className="text-container">
          <img src={busImage} alt="Blasti Logo" className="logo-image m-4" />
          <h1 className='m-4'>Blasti</h1>
          <p className='m-4 subtitle'>Une application qui va faciliter votre vie.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

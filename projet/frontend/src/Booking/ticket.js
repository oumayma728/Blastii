import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './ticket.css';

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const qrCodeRef = useRef();
  const { state } = location || {};
  const { ticket } = state || {};
  const [busNumber, setBusNumber] = useState(null);

  useEffect(() => {
    if (ticket?.bus) {
      fetch(`http://localhost:5000/api/buses/${ticket.bus}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch bus details');
          }
          return response.json();
        })
        .then((data) => {
          setBusNumber(data.busNumber || 'N/A');
        })
        .catch((error) => {
          console.error('Error fetching bus details:', error);
          setBusNumber('Error loading bus number');
        });
    }
  }, [ticket?.bus]);

  if (!ticket) {
    return (
      <div className="ticket-container">
        <p>No ticket details available.</p>
        <button onClick={() => navigate('/')} className="button-home">
          Go to Home
        </button>
      </div>
    );
  }

  const qrContent = `Ticket Details:
User ID: ${ticket.user}
Bus Number: ${busNumber || 'Loading...'}
Seats: ${ticket.seatNumber.join(', ')}
Total Price: $${ticket.totalPrice}
Payment Status: ${ticket.paymentStatus}`;

  const handleDownloadQRCode = () => {
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (canvas) {
      const qrCodeDataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = 'ticket_qr_code.png';
      link.click();
    } else {
      alert('Failed to generate QR code.');
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(qrContent)
      .then(() => {
        alert('Ticket info copied to clipboard!');
      })
      .catch((err) => {
        alert('Failed to copy to clipboard: ' + err);
      });
  };

  return (
    <div className="ticket-container">
      <h3 className="ticket-header">Booking Ticket</h3>
      <div className="ticket-details">
        <p>
          <strong>User ID:</strong> {ticket.user}
        </p>
        <p>
          <strong>Bus Number:</strong> {ticket.bus}
        </p>
        <p>
          <strong>Seat Number(s):</strong> {ticket.seatNumber.join(', ')}
        </p>
        <p>
          <strong>Payment Status:</strong> {ticket.paymentStatus || 'Loading...'}
        </p>
        <p>
          <strong>Total Price:</strong> ${ticket.totalPrice}
        </p>
      </div>
      <div className="qr-code-container">
        <p>
          <strong>Scan to view ticket:</strong>
        </p>
        <div ref={qrCodeRef}>
          <QRCodeCanvas value={qrContent} size={256} />
        </div>
        <button onClick={handleDownloadQRCode} className="button-download">
          Download QR Code
        </button>
      </div>
      <button onClick={handleCopyToClipboard} className="button-copy">
        Copy Ticket Info to Clipboard
      </button>
      <button onClick={() => navigate('/')} className="button-home">
        Go to Home
      </button>
    </div>
  );
};

export default Ticket;

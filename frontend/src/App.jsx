import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Create a separate axios instance for better control
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

function App() {
  const [coupon, setCoupon] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState(new AbortController());

  // Cleanup effect for aborting pending requests
  useEffect(() => {
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [controller]);

  const handleClaim = async () => {
    setIsLoading(true);
    setError('');
    setCoupon('');
    
    try {
      const newController = new AbortController();
      setController(newController);

      const response = await api.post('/claim', {}, {
        signal: newController.signal
      });
      
      setCoupon(response.data.coupon);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled:', err.message);
      } else {
        const errorMessage = err.response?.data?.error 
          || err.message 
          || 'Failed to claim coupon';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Round-Robin Coupon Distribution</h1>
      {coupon && (
        <div style={{ margin: '1rem', padding: '1rem', backgroundColor: '#e8f5e9' }}>
          <h2>Your Coupon: {coupon}</h2>
        </div>
      )}
      {error && (
        <div style={{ margin: '1rem', padding: '1rem', backgroundColor: '#ffebee' }}>
          <p style={{ color: '#b71c1c' }}>{error}</p>
        </div>
      )}
      <button
        onClick={handleClaim}
        disabled={isLoading}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: isLoading ? '#cccccc' : '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isLoading ? 'Processing...' : 'Claim Coupon'}
      </button>
    </div>
  );
}

export default App;
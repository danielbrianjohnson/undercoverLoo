import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header style={{
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {/* Logo */}
      <Link 
        to="/" 
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          textDecoration: 'none',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        🚽 Undercover Loo
      </Link>

      {/* Navigation */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link 
            to="/" 
            style={{
              backgroundColor: 'white',
              color: '#1a1a1a',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🏠 Home
          </Link>
        <Link 
          to="/add" 
          style={{
            backgroundColor: 'white',
            color: '#1a1a1a',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          + Add Spot
        </Link>
        
        {/* User Avatar Placeholder */}
        <div style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          backgroundColor: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem'
        }}>
          👤
        </div>
      </nav>
    </header>
  );
};

export default Header;

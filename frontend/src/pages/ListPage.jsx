import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LooCard from '../components/LooCard';

const ListPage = () => {
  const [loos, setLoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const cities = ['All Cities', 'Hong Kong', 'Tokyo', 'Paris'];

  useEffect(() => {
    const fetchLoos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/loos/');
        setLoos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch loo locations');
        setLoading(false);
        console.error('Error fetching loos:', err);
      }
    };

    fetchLoos();
  }, []);

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    return '⭐'.repeat(rating);
  };

  const getTypeIcon = (tags) => {
    if (!tags || tags.length === 0) return '🚽';
    if (tags.includes('Luxury') || tags.includes('Hotel Hack')) return '🏨';
    if (tags.includes('Coffee Shop')) return '☕';
    if (tags.includes('Free')) return '🆓';
    return '🚽';
  };

  const filteredLoos = loos.filter(loo => {
    const matchesSearch = !searchQuery || 
      loo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loo.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCity = selectedCity === 'All Cities' || 
      loo.name?.toLowerCase().includes(selectedCity.toLowerCase());
    
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading bathroom locations...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: 'red'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Search and Filter Bar */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        // top: '80px',
        zIndex: 100
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search by city, location name, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              backgroundColor: '#f9fafb'
            }}
          />
          <div style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '1.2rem'
          }}>
            🔍
          </div>
          <button
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              padding: '0.25rem 0.5rem',
              fontSize: '0.8rem',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            🔧 Filters
          </button>
        </div>

        {/* City Filter Pills */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                border: 'none',
                backgroundColor: selectedCity === city ? '#1a1a1a' : '#f3f4f6',
                color: selectedCity === city ? 'white' : '#374151',
                cursor: 'pointer',
                minWidth: 'fit-content',
                fontWeight: selectedCity === city ? '600' : '400',
                fontSize: '0.9rem'
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem'
      }}>
        {/* Placeholder when no locations */}
        {filteredLoos.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Interactive Map View</h3>
            <p style={{ margin: '0', color: '#6b7280' }}>Google Maps integration would go here</p>
          </div>
        )}

        {/* Location Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredLoos.map((loo) => (
            <LooCard key={loo.id} loo={loo} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          color: '#6b7280',
          fontSize: '0.9rem'
        }}>
          Your #2 is our #1 • Crowdsourced by travelers, for travelers
        </div>
      </div>
    </div>
  );
};

export default ListPage;

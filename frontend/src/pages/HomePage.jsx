import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';
import LooCard from '../components/LooCard';

const HomePage = () => {
  const [loos, setLoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

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

  const filteredLoos = loos.filter(loo => {
    const matchesSearch = !searchQuery || 
      loo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loo.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // For now, since we don't have city data, just filter by search
    // In the future, you could use reverse geocoding to get city names from coordinates
    const matchesCity = selectedCity === 'All Cities' || 
      loo.name?.toLowerCase().includes(selectedCity.toLowerCase()) ||
      loo.tags?.some(tag => tag.toLowerCase().includes(selectedCity.toLowerCase()));
    
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

  // Full Map Mode
  if (viewMode === 'map') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar for Map Mode */}
        <div style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 1000
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
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
          </div>

          {/* Filters Button */}
          <button
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🔧 Filters
          </button>

          {/* List View Button */}
          <button
            onClick={() => setViewMode('list')}
            style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            📋 List View
          </button>
        </div>

        {/* Full Screen Map */}
        <div style={{ flex: 1 }}>
          <MapView 
            loos={filteredLoos} 
            height="100%" 
            fullScreen={true}
            showLocationButton={true}
          />
        </div>
      </div>
    );
  }

  // List Mode (Default)
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

        {/* City Filter Pills and Map View Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            flex: 1
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
          
          {/* Map View Button */}
          <button
            onClick={() => setViewMode('map')}
            style={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: 'fit-content'
            }}
          >
            🗺️ Map View
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem'
      }}>
        {/* Map Section */}
        <div 
          style={{ 
            marginBottom: '2rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => setViewMode('map')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <MapView 
            loos={filteredLoos} 
            height="400px" 
            showLocationButton={false}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none'
          }}
          className="map-overlay"
        >
          🗺️ Click to view full map
        </div>
        </div>

        {/* List Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredLoos.map((loo) => (
            <LooCard key={loo.id} loo={loo} />
          ))}
        </div>

        {/* Placeholder when no locations */}
        {filteredLoos.length === 0 && (
          <div style={{
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚽</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>No bathrooms found</h3>
            <p style={{ margin: '0', color: '#6b7280' }}>Try adjusting your search or filters</p>
          </div>
        )}

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

      {/* CSS for hover effect */}
      <style jsx>{`
        .map-container:hover .map-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default HomePage;

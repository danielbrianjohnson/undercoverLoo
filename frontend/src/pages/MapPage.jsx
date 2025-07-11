import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const [loos, setLoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([34.0725, -118.3889]); // Default to LA
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  // Default center (Los Angeles coordinates)
  const defaultCenter = [34.0725, -118.3889];

  const cities = ['All Cities', 'Hong Kong', 'Tokyo', 'Paris'];

  // Get user's current location on component mount
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = [position.coords.latitude, position.coords.longitude];
            setUserLocation(userPos);
            setMapCenter(userPos);
          },
          (error) => {
            console.log('Geolocation error:', error);
            // Fall back to default center (Los Angeles)
            setMapCenter(defaultCenter);
          }
        );
      } else {
        console.log('Geolocation not supported');
        setMapCenter(defaultCenter);
      }
    };

    getUserLocation();
  }, []);

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

  const handleMyLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);
          if (map) {
            map.setView(userPos, 15);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading loo locations...
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
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Search and Filter Bar */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
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

      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={L.divIcon({
              html: '📍',
              className: 'user-location-marker',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })}
          >
            <Popup>
              <div>
                <h3>📍 Your Location</h3>
                <p>You are here!</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {loos.map((loo) => (
          <Marker
            key={loo.id}
            position={[loo.latitude, loo.longitude]}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  {loo.name || 'Unnamed Loo'}
                </h3>
                {loo.description && (
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                    {loo.description.length > 100 
                      ? loo.description.substring(0, 100) + '...' 
                      : loo.description
                    }
                  </p>
                )}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                  {loo.cleanliness > 0 && (
                    <span style={{ fontSize: '0.8rem' }}>
                      <strong>Clean:</strong> {'⭐'.repeat(loo.cleanliness)}
                    </span>
                  )}
                  {loo.privacy > 0 && (
                    <span style={{ fontSize: '0.8rem' }}>
                      <strong>Private:</strong> {'⭐'.repeat(loo.privacy)}
                    </span>
                  )}
                </div>
                {loo.tags && loo.tags.length > 0 && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    {loo.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#e5e7eb',
                          color: '#374151',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.7rem',
                          marginRight: '0.25rem',
                          marginBottom: '0.25rem'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  to={`/loo/${loo.id}`}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* My Location Button */}
      <button
        onClick={handleMyLocationClick}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Center map on my location"
      >
        📍
      </button>

      {/* Placeholder for map content when no locations */}
      {loos.length === 0 && !loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Interactive Map View</h3>
          <p style={{ margin: '0', color: '#6b7280' }}>Google Maps integration would go here</p>
        </div>
      )}
    </div>
  );
};

export default MapPage;

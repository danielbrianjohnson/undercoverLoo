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

  // Default center (Los Angeles coordinates)
  const defaultCenter = [34.0725, -118.3889];

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
        setError('Failed to fetch bathroom locations');
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
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: 'calc(100% - 80px)', width: '100%' }}
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
              <div>
                <h3>{loo.name || 'Unnamed Loo'}</h3>
                <p>{loo.description || 'No description'}</p>
                {loo.cleanliness > 0 && (
                  <p><strong>Cleanliness:</strong> {loo.cleanliness}/5</p>
                )}
                {loo.privacy > 0 && (
                  <p><strong>Privacy:</strong> {loo.privacy}/5</p>
                )}
                {loo.tags && loo.tags.length > 0 && (
                  <p><strong>Tags:</strong> {loo.tags.join(', ')}</p>
                )}
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
          bottom: '100px',
          right: '20px',
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

      {/* View List Button */}
      <Link 
        to="/list"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}
      >
        📋 View List
      </Link>

      {/* City Filter Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        overflowX: 'auto'
      }}>
        <span style={{ fontWeight: 'bold', minWidth: 'fit-content' }}>Cities:</span>
        {['All Cities', 'Los Angeles', 'San Francisco', 'New York', 'Tokyo'].map((city) => (
          <button
            key={city}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              border: city === 'All Cities' ? '2px solid #3b82f6' : '1px solid #d1d5db',
              backgroundColor: city === 'All Cities' ? '#eff6ff' : 'white',
              color: city === 'All Cities' ? '#3b82f6' : '#374151',
              cursor: 'pointer',
              minWidth: 'fit-content',
              fontWeight: city === 'All Cities' ? 'bold' : 'normal'
            }}
            onClick={() => {
              // TODO: Implement city filtering
              console.log('Filter by city:', city);
            }}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapPage;

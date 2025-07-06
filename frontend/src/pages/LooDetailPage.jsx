import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

const LooDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loo, setLoo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/loos/${id}/`);
        setLoo(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch loo details');
        setLoading(false);
        console.error('Error fetching loo:', err);
      }
    };

    fetchLoo();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) return '⭐ Not rated';
    return '⭐'.repeat(rating) + ` (${rating}/5)`;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px'
      }}>
        Loading loo details...
      </div>
    );
  }

  if (error || !loo) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: 'red',
        gap: '1rem'
      }}>
        <p>{error || 'Loo not found'}</p>
        <Link 
          to="/list"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Back to List
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      {/* Header with Back Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            to="/list"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            📋 List
          </Link>
          <Link 
            to="/"
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            🗺️ Map
          </Link>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{ padding: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            margin: '0 0 1rem 0',
            color: '#1f2937'
          }}>
            🚽 {loo.name || 'Unnamed Loo'}
          </h1>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1.1rem',
            margin: '0 0 1.5rem 0'
          }}>
            📍 {loo.latitude.toFixed(6)}, {loo.longitude.toFixed(6)}
          </p>

          {/* Ratings */}
          <div style={{ 
            display: 'flex', 
            gap: '3rem', 
            marginBottom: '2rem',
            fontSize: '1.1rem'
          }}>
            <div>
              <strong>Cleanliness:</strong> {renderStars(loo.cleanliness)}
            </div>
            <div>
              <strong>Privacy:</strong> {renderStars(loo.privacy)}
            </div>
          </div>

          {/* Description */}
          {loo.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                color: '#374151'
              }}>
                Access Tips & Description
              </h3>
              <p style={{ 
                color: '#4b5563', 
                lineHeight: '1.6',
                fontSize: '1rem',
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                {loo.description}
              </p>
            </div>
          )}

          {/* Photos */}
          {loo.images && loo.images.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                color: '#374151'
              }}>
                📸 Photos
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem'
              }}>
                {loo.images.map((image, index) => (
                  <img
                    key={image.id}
                    src={image.image}
                    alt={`Loo photo ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      window.open(image.image, '_blank');
                    }}
                  />

                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {loo.tags && loo.tags.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                color: '#374151'
              }}>
                Tags
              </h3>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.75rem'
              }}>
                {loo.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.5rem 1rem',
                      borderRadius: '1rem',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Date Added */}
          <div style={{ 
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1rem',
            marginTop: '2rem'
          }}>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '0.9rem',
              margin: 0
            }}>
              Added on {formatDate(loo.created_at)}
            </p>
          </div>
        </div>

        {/* Map Section */}
        <div style={{ 
          height: '300px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <MapContainer
            center={[loo.latitude, loo.longitude]}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[loo.latitude, loo.longitude]} />
          </MapContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/search/?api=1&query=${loo.latitude},${loo.longitude}`;
            window.open(url, '_blank');
          }}
          style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          🧭 Get Directions
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: loo.name || 'Loo Location',
                text: `Check out this loo location: ${loo.name || 'Unnamed Loo'}`,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          style={{
            backgroundColor: '#7c3aed',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          📤 Share Location
        </button>
      </div>
    </div>
  );
};

export default LooDetailPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListPage = () => {
  const [loos, setLoos] = useState([]);
  const [filteredLoos, setFilteredLoos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const cities = ['All Cities', 'Los Angeles', 'San Francisco', 'New York', 'Tokyo'];

  useEffect(() => {
    const fetchLoos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/loos/');
        setLoos(response.data);
        setFilteredLoos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bathroom locations');
        setLoading(false);
        console.error('Error fetching loos:', err);
      }
    };

    fetchLoos();
  }, []);

  useEffect(() => {
    let filtered = loos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(loo =>
        (loo.name && loo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (loo.description && loo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by city (placeholder logic)
    if (selectedCity !== 'All Cities') {
      // For now, we'll just show all since we don't have city data
      // In a real app, you'd filter by loo.city === selectedCity
    }

    setFilteredLoos(filtered);
  }, [loos, searchTerm, selectedCity]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
        height: '50vh',
        fontSize: '18px',
        color: 'red'
      }}>
        {error}
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          margin: 0
        }}>
          🧾 Bathroom List
        </h1>
        <Link 
          to="/"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          🗺️ Back to Map
        </Link>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search bathrooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>

      {/* City Filter Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              border: city === selectedCity ? '2px solid #3b82f6' : '1px solid #d1d5db',
              backgroundColor: city === selectedCity ? '#eff6ff' : 'white',
              color: city === selectedCity ? '#3b82f6' : '#374151',
              cursor: 'pointer',
              fontWeight: city === selectedCity ? 'bold' : 'normal'
            }}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p style={{ 
        marginBottom: '1.5rem', 
        color: '#6b7280',
        fontSize: '0.9rem'
      }}>
        Showing {filteredLoos.length} bathroom{filteredLoos.length !== 1 ? 's' : ''}
      </p>

      {/* Bathroom Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredLoos.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              No bathrooms found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          filteredLoos.map((loo) => (
            <div
              key={loo.id}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold',
                    margin: '0 0 0.5rem 0'
                  }}>
                    {loo.name || 'Unnamed Loo'}
                  </h3>
                  <p style={{ 
                    color: '#6b7280', 
                    margin: '0 0 0.5rem 0',
                    fontSize: '0.9rem'
                  }}>
                    📍 {loo.latitude.toFixed(4)}, {loo.longitude.toFixed(4)}
                  </p>
                </div>
                <Link
                  to={`/loo/${loo.id}`}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  View Details
                </Link>
              </div>

              {/* Ratings */}
              <div style={{ 
                display: 'flex', 
                gap: '2rem', 
                marginBottom: '1rem',
                fontSize: '0.9rem'
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
                <p style={{ 
                  color: '#374151', 
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>
                  {loo.description.length > 150 
                    ? `${loo.description.substring(0, 150)}...` 
                    : loo.description
                  }
                </p>
              )}

              {/* Tags */}
              {loo.tags && loo.tags.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {loo.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Date Added */}
              <p style={{ 
                color: '#9ca3af', 
                fontSize: '0.8rem',
                margin: 0
              }}>
                Added on {formatDate(loo.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListPage;

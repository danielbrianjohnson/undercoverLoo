import React from 'react';
import { Link } from 'react-router-dom';

const LooCard = ({ loo }) => {
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

  // Generate mock rating and review count for demo
  const mockRating = Math.max(loo.cleanliness, loo.privacy) || 4;
  const mockReviewCount = Math.floor(Math.random() * 200) + 50;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 0.25rem 0', 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            {loo.name || 'Unnamed Location'}
          </h3>
          <p style={{ 
            margin: '0', 
            color: '#6b7280', 
            fontSize: '0.9rem' 
          }}>
            {loo.city || 'Unknown City'}
          </p>
        </div>
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: '#374151'
        }}>
          {loo.tags && loo.tags.includes('Luxury') ? 'Luxury Hotel' : 
           loo.tags && loo.tags.includes('Coffee Shop') ? 'Coffee Shop' :
           loo.tags && loo.tags.includes('Public') ? 'Public Restroom' : 'Restroom'}
        </div>
      </div>

      {/* Rating */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ fontSize: '1.1rem' }}>
            {renderStars(mockRating) || '⭐⭐⭐⭐'}
          </span>
          <span style={{ 
            fontSize: '0.9rem', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {mockRating}.{Math.floor(Math.random() * 10)}
          </span>
          <span style={{ 
            fontSize: '0.8rem', 
            color: '#6b7280' 
          }}>
            ({mockReviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Tags */}
      {loo.tags && loo.tags.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          {loo.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: '#e5e7eb',
                color: '#374151',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {loo.description && (
        <p style={{ 
          margin: '0 0 1rem 0', 
          color: '#4b5563', 
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          {loo.description.length > 120 
            ? loo.description.substring(0, 120) + '...' 
            : loo.description
          }
        </p>
      )}

      {/* Footer */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #f3f4f6'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          color: '#6b7280',
          fontSize: '0.8rem'
        }}>
          <span>🕒</span>
          <span>{formatDate(loo.created_at)}</span>
        </div>
        <Link
          to={`/loo/${loo.id}`}
          style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default LooCard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddLooPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    type: '',
    latitude: '',
    longitude: '',
    cleanliness: 0,
    privacy: 0,
    tags: []
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableTags = [
    'Clean', 'Free', 'Emergency', '24/7', 'Quiet', 'Purchase Required', 
    'Busy', 'Luxury', 'Hotel Hack', 'Hidden'
  ];

  const additionalInfo = [
    'Requires purchase', 'Has attendant', 'Wheelchair accessible'
  ];

  const looTypes = [
    'Public Restroom', 'Hotel', 'Coffee Shop', 'Restaurant', 
    'Gas Station', 'Mall', 'Park', 'Library', 'Luxury Hotel', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = [];
    const previews = [];
    
    for (let file of files) {
      // Check file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Only JPEG and PNG images are allowed.');
        continue;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be less than 5MB.');
        continue;
      }
      
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }
    
    setSelectedImages(validFiles);
    setImagePreviews(previews);
    setError(''); // Clear any previous errors
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setError(''); // Clear any previous errors
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your location. Please check your browser settings and try again.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const uploadImages = async (looId) => {
    const uploadPromises = selectedImages.map(async (image) => {
      const formData = new FormData();
      formData.append('loo_id', looId);
      formData.append('image', image);
      
      return axios.post('http://localhost:8000/api/upload-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
    
    await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      setError('Location coordinates are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        cleanliness: parseInt(formData.cleanliness) || 0,
        privacy: parseInt(formData.privacy) || 0,
        tags: formData.tags
      };

      // First, create the loo
      const looResponse = await axios.post('http://localhost:8000/api/loos/', submitData);
      const looId = looResponse.data.id;

      // Then upload images if any are selected
      if (selectedImages.length > 0) {
        await uploadImages(looId);
      }

      navigate('/');
    } catch (err) {
      setError('Failed to add bathroom location. Please try again.');
      console.error('Error adding loo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      paddingTop: '2rem'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 2rem 2rem 2rem'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#6b7280',
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Map
        </button>

        {/* Main Form Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: '#1f2937'
          }}>
            Add a New Spot
          </h1>
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem',
            fontSize: '1rem'
          }}>
            Help fellow travelers by sharing a great bathroom location
          </p>

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '2rem',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Location Name and Type Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  Location Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Starbucks on 5th Ave"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#f9fafb'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <option value="">Select type</option>
                  {looTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address and City Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address or landmark"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#f9fafb'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#374151'
                }}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#f9fafb'
                  }}
                />
              </div>
            </div>

            {/* Use Current Location Button */}
            <button
              type="button"
              onClick={getCurrentLocation}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                color: '#374151',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: 'fit-content'
              }}
            >
              📍 Use Current Location
            </button>

            {/* Access Tips */}
            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Access Tips *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="How do you get in? What should people wear? Any special instructions?"
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#f9fafb',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Tags (select all that apply)
              </label>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem'
              }}>
                {availableTags.map(tag => (
                  <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#374151' }}>{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Additional Information
              </label>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem'
              }}>
                {additionalInfo.map(info => (
                  <label key={info} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(info)}
                      onChange={() => handleTagToggle(info)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#374151' }}>{info}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label style={{ 
                display: 'block', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Photos (optional)
              </label>
              <div
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('photo-input').click()}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Add Photos</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Please be respectful - no photos of people or inappropriate content
                </div>
                <input
                  id="photo-input"
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '1rem', 
                  marginTop: '1rem' 
                }}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#1a1a1a',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Adding Location...' : 'Add Location'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLooPage;

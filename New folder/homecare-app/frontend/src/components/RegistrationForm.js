import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './RegistrationForm.css';

const RegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    medicalHistory: '',
    currentMedications: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, '')))
      newErrors.phoneNumber = 'Phone number should be at least 10 digits';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.emergencyContactName.trim())
      newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactPhone)
      newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    if (!formData.termsAccepted)
      newErrors.termsAccepted = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/registrations', formData);
      setSuccessMessage(response.data.message);
      
      // Get registration code from response
      const code = response.data.data?.registrationCode;
      if (code) {
        setRegistrationCode(code);
        
        // Fetch the share link details from backend
        try {
          const shareResponse = await axios.get(`/api/registrations/share-link/${code}`);
          setRegistrationLink(shareResponse.data.registrationLink);
          setWhatsappUrl(shareResponse.data.whatsappShareLink);
        } catch (shareError) {
          console.error('Error fetching share link:', shareError);
        }
      }
      
      // Don't clear the form, show success state instead
      // setTimeout(() => {
      //   onSuccess();
      // }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewRegistration = () => {
    setRegistrationCode('');
    setRegistrationLink('');
    setWhatsappUrl('');
    setSuccessMessage('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      medicalHistory: '',
      currentMedications: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      termsAccepted: false,
    });
    setErrors({});
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(registrationLink);
    alert('Registration link copied to clipboard!');
  };

  // Show success view with registration code and share options
  if (registrationCode) {
    return (
      <div className="registration-form-container">
        <div className="registration-success">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          
          <div className="success-message">
            <p>{successMessage}</p>
          </div>

          <div className="registration-code-section">
            <h3>Your Registration Code</h3>
            <div className="registration-code-display">
              <code>{registrationCode}</code>
            </div>
          </div>

          <div className="qr-code-section">
            <h3>Scan to Register</h3>
            <div className="qr-code-container">
              <QRCodeCanvas 
                value={registrationLink} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-hint">Scan this QR code with your phone to access the registration link</p>
          </div>

          <div className="share-options">
            <h3>Share Registration Link</h3>
            <div className="button-group">
              <button 
                className="share-button whatsapp-button"
                onClick={() => window.open(whatsappUrl, '_blank')}
              >
                📱 Share via WhatsApp
              </button>
              
              <button 
                className="share-button copy-button"
                onClick={handleCopyToClipboard}
              >
                📋 Copy Link
              </button>

              <button 
                className="share-button email-button"
                onClick={() => {
                  window.location.href = `mailto:?subject=Complete Your Homecare Registration&body=${encodeURIComponent(registrationLink)}`;
                }}
              >
                📧 Share via Email
              </button>
            </div>
          </div>

          <div className="registration-link-section">
            <h4>Direct Registration Link:</h4>
            <input 
              type="text" 
              value={registrationLink} 
              readOnly 
              className="link-input"
            />
          </div>

          <button 
            className="new-registration-button"
            onClick={handleStartNewRegistration}
          >
            Register Another Patient
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-form-container">
      <h2>Patient Registration Form</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="registration-form">
        {/* Personal Information Section */}
        <fieldset className="form-section">
          <legend>Personal Information</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10 digits minimum"
                className={errors.phoneNumber ? 'input-error' : ''}
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'input-error' : ''}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? 'input-error' : ''}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          </div>
        </fieldset>

        {/* Address Information Section */}
        <fieldset className="form-section">
          <legend>Address Information</legend>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'input-error' : ''}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'input-error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'input-error' : ''}
              />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">Zip Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? 'input-error' : ''}
              />
              {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
          </div>
        </fieldset>

        {/* Medical Information Section */}
        <fieldset className="form-section">
          <legend>Medical Information</legend>

          <div className="form-group">
            <label htmlFor="medicalHistory">Medical History (Optional)</label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="4"
              placeholder="Please provide relevant medical history"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="currentMedications">Current Medications (Optional)</label>
            <textarea
              id="currentMedications"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleChange}
              rows="4"
              placeholder="List any medications you are currently taking"
            ></textarea>
          </div>
        </fieldset>

        {/* Emergency Contact Section */}
        <fieldset className="form-section">
          <legend>Emergency Contact Information</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emergencyContactName">Emergency Contact Name *</label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className={errors.emergencyContactName ? 'input-error' : ''}
              />
              {errors.emergencyContactName && (
                <span className="error-message">{errors.emergencyContactName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="emergencyContactPhone">Emergency Contact Phone *</label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                placeholder="10 digits minimum"
                className={errors.emergencyContactPhone ? 'input-error' : ''}
              />
              {errors.emergencyContactPhone && (
                <span className="error-message">{errors.emergencyContactPhone}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactRelation">Relationship (Optional)</label>
            <input
              type="text"
              id="emergencyContactRelation"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={handleChange}
              placeholder="e.g., Spouse, Parent, Sibling"
            />
          </div>
        </fieldset>

        {/* Terms and Conditions */}
        <fieldset className="form-section">
          <legend>Acknowledgment</legend>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className={errors.termsAccepted ? 'input-error' : ''}
            />
            <label htmlFor="termsAccepted">
              I agree to the terms and conditions and confirm that the information provided is accurate *
            </label>
            {errors.termsAccepted && (
              <span className="error-message">{errors.termsAccepted}</span>
            )}
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <button
            type="reset"
            className="reset-button"
            onClick={() => {
              setErrors({});
              setSuccessMessage('');
              setErrorMessage('');
            }}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;

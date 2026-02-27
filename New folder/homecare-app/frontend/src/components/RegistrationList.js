import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegistrationList.css';

const RegistrationList = ({ refresh }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, [refresh]);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/registrations');
      setRegistrations(response.data);
    } catch (err) {
      setError('Failed to fetch registrations. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (registration) => {
    setEditingId(registration.id);
    setEditData({ ...registration });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleChangeEdit = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`/api/registrations/${id}`, editData);
      setRegistrations(
        registrations.map((reg) => (reg.id === id ? editData : reg))
      );
      setEditingId(null);
      setEditData(null);
    } catch (err) {
      setError('Failed to update registration. Please try again.');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await axios.delete(`/api/registrations/${id}`);
        setRegistrations(registrations.filter((reg) => reg.id !== id));
      } catch (err) {
        setError('Failed to delete registration. Please try again.');
        console.error('Error:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading registrations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (registrations.length === 0) {
    return <div className="no-data">No registrations found. Please register first.</div>;
  }

  return (
    <div className="registration-list-container">
      <h2>Registered Patients ({registrations.length})</h2>

      <div className="table-responsive">
        <table className="registration-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Registration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id} className="table-row">
                <td>{registration.id}</td>
                <td>{registration.firstName} {registration.lastName}</td>
                <td>{registration.email}</td>
                <td>{registration.phoneNumber}</td>
                <td>{registration.city}</td>
                <td>{new Date(registration.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button
                    className="btn-view"
                    onClick={() => handleEdit(registration)}
                  >
                    View/Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(registration.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingId && editData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Registration - {editData.firstName} {editData.lastName}</h3>
              <button className="close-button" onClick={handleCancelEdit}>×</button>
            </div>

            <div className="modal-body">
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleChangeEdit}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleChangeEdit}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChangeEdit}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editData.phoneNumber}
                      onChange={handleChangeEdit}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={editData.address}
                      onChange={handleChangeEdit}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editData.city}
                      onChange={handleChangeEdit}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={editData.state}
                      onChange={handleChangeEdit}
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={editData.zipCode}
                      onChange={handleChangeEdit}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={editData.medicalHistory || ''}
                    onChange={handleChangeEdit}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Current Medications</label>
                  <textarea
                    name="currentMedications"
                    value={editData.currentMedications || ''}
                    onChange={handleChangeEdit}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={editData.emergencyContactName}
                      onChange={handleChangeEdit}
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={editData.emergencyContactPhone}
                      onChange={handleChangeEdit}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Emergency Contact Relation</label>
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={editData.emergencyContactRelation || ''}
                    onChange={handleChangeEdit}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-save"
                onClick={() => handleSaveEdit(editingId)}
              >
                Save Changes
              </button>
              <button
                className="btn-cancel"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationList;

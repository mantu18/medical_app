import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import RegistrationList from './components/RegistrationList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [refreshList, setRefreshList] = useState(false);

  const handleRegistrationSuccess = () => {
    setRefreshList(!refreshList);
    setActiveTab('list');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Homecare Patient Registration System</h1>
        <p className="subtitle">Register for our homecare services</p>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Register
          </button>
          <button
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            View Registrations
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'form' && (
            <RegistrationForm onSuccess={handleRegistrationSuccess} />
          )}
          {activeTab === 'list' && (
            <RegistrationList refresh={refreshList} />
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>&copy; 2026 Homecare Registration System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

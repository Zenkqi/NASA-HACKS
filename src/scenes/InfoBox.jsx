import React, { useState } from 'react';
import './InfoBox.css'; // Import the CSS file

const InfoBox = ({ selectedObject, setSelectedObject }) => {
  const [activeTab, setActiveTab] = useState('overview'); // Local state for active tab

  return (
    <>
      <div className="info-box">
        {/* Close Button */}
        
        <button
          onClick={() => {
            setSelectedObject(null);
            setActiveTab('overview'); 
          }}
          className="close-button"
        >
          ×
        </button>
        <h2>{selectedObject.name}</h2>

        {/* Tabs */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('composition')}
            className={`tab-button ${activeTab === 'composition' ? 'active' : ''}`}
          >
            Composition
          </button>
          <button
            onClick={() => setActiveTab('orbit')}
            className={`tab-button ${activeTab === 'orbit' ? 'active' : ''}`}
          >
            Orbit Details
          </button>
        </div>
        {/* Content */}
        <div className="content">
          {activeTab === 'overview' && (
            <div>
              <p>{selectedObject.info}</p>
            </div>
          )}
          {activeTab === 'composition' && (
            <div>
              <p>{selectedObject.composition}</p>
            </div>
          )}
          {activeTab === 'orbit' && (
            <div>
              <p>{selectedObject.orbitDetails}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InfoBox;

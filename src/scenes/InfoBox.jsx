// src/components/InfoBox.jsx

import React, { useState } from 'react';

const InfoBox = ({ selectedObject, setSelectedObject }) => {
  const [activeTab, setActiveTab] = useState('overview'); // Local state for active tab

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '80%', // Adjusted for better positioning
          transform: 'translate(-50%, -50%) scale(1)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '20px',
          borderRadius: '10px',
          width: '300px',
          height: '400px',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'popUp 0.5s ease',
          overflow: 'hidden',
          zIndex: 1, // Ensure it appears above other elements
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedObject(null);
            setActiveTab('overview'); // Reset active tab
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            color: '#000',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #ccc',
            marginTop: '40px',
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: activeTab === 'overview' ? '#e0e0e0' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '2px solid #000' : 'none',
              cursor: 'pointer',
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('composition')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: activeTab === 'composition' ? '#e0e0e0' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'composition' ? '2px solid #000' : 'none',
              cursor: 'pointer',
            }}
          >
            Composition
          </button>
          <button
            onClick={() => setActiveTab('orbit')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: activeTab === 'orbit' ? '#e0e0e0' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'orbit' ? '2px solid #000' : 'none',
              cursor: 'pointer',
            }}
          >
            Orbit Details
          </button>
        </div>
        {/* Content */}
        <div
          style={{
            padding: '10px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          <h2>{selectedObject.name}</h2>
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
      {/* Keyframe Animation */}
      <style>
        {`
          @keyframes popUp {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 0;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default InfoBox;
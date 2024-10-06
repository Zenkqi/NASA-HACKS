import React, { useState } from 'react';
import './SideBar.css'

const SideBar = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="button-container">
      <button onClick={togglePanel} className="toggle-button">
        {isPanelOpen ? 'Close Panel' : 'Open Panel'}
      </button>
      <div className={`side-panel ${isPanelOpen ? 'open' : 'closed'}`}>
        <div className="stats-box">
          <h2>Stats</h2>
          <p>Energy </p>
        </div>
        <div className="buttons-box">
          <h2>Upgrades</h2>

          <button onClick={() => console.log("dog")}>
            Buy Fossil Fuel Generator (Cost: 100 Resources)
          </button>

          {/* Add more upgrade buttons as needed */}
        </div>
      </div>
    </div>
  );
};

export default SideBar;

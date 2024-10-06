import React from 'react';
import './SideBar.css';

const SidePanel = () => {
  return (
    <div className="side-panel">
      <h2 className="side-panel-title">Filter</h2>
      <button>Large Objects</button>
      <button>Fast Objects</button>
      <button>Far Objects</button>
    </div>
  );
};

export default SidePanel;

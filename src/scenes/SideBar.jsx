import React from 'react';
import './SideBar.css';

const SideBar = () => {
  return (
    <div className="side-panel">
            <button
                onClick={() => {
                    console.log("hi"); 
                }}
                className="close-button"
            >
                ×
            </button>
            <h2 className="side-panel-title">Filter</h2>
            <button>Large Objects</button>
            <button>Fast Objects</button>
            <button>Far Objects</button>

    </div>
  );
};

export default SideBar;

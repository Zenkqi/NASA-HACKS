import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection({ hide }) {
  return (
    <div className={`hero-container ${hide ? 'hidden' : ''}`}>
      <h1>ADVENTURE AWAITS</h1>
      <h2>Scroll down to learn more</h2>
      <div className='hero-btns'>
      </div>
    </div>
  );
}

export default HeroSection;
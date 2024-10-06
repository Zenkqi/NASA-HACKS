import React, { useEffect, useState } from 'react';
import '../../App.css';
import HeroSection from '../HeroSection';
import SolarSystemScene from '../../scenes/SolarSystemScene.jsx';
import Footer from '../Footer';
import './Home.css';

function Home() {
  const [hideHero, setHideHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight; // 100vh
      if (window.scrollY > scrollThreshold / 2) { // Hide after scrolling half the viewport height
        setHideHero(true);
      } else {
        setHideHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='home-container'>
      <SolarSystemScene />
      <HeroSection hide={hideHero} />
      <div className='additional-content'>
        {/* This div ensures the page height is 200vh */}
        {/* Add more content here if desired */}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
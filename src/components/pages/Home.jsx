import React from 'react';
import '../../App.css';
import HeroSection from '../HeroSection';
import Cards from '../Cards';
import Footer from '../Footer';
import Scene from '../../scenes/SolarSystem.jsx';


function Home () {
    return (
        <>  
            <HeroSection/>
            <Scene/>
        </>
    );
}

export default Home; 
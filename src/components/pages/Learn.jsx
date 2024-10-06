import React from 'react';
import '../../App.css';
import './Learn.css'; // Import the new CSS file for custom styles
import Footer from '../Footer';

function Learn() {
    return (
        <div className="learn-container">
            <h1 className='learn-more'>More Information</h1>
            <div className="info-session-container">
                <h1 className='info-session'>Info Session: Near-Earth Objects & Solar System</h1>
                <p className="intro-text">
                    Near-Earth objects (NEOs) are asteroids and comets that come close to Earth's orbit. Understanding them is crucial for planetary defense and space exploration.
                </p>
                <p className="intro-text">
                    Our solar system consists of the Sun and everything that orbits around it, including planets, moons, asteroids, comets, and smaller objects.
                </p>

                <h2>The Sun</h2>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 1,391,000 km (109 times the diameter of Earth)</li>
                    <li><strong>Mass:</strong> 1.989 × 10³⁰ kg (~330,000 times Earth's mass)</li>
                    <li><strong>Composition:</strong> 73% hydrogen, 25% helium, and trace amounts of heavier elements</li>
                    <li><strong>Core Temperature:</strong> ~15 million °C</li>
                </ul>

                <h2>Terrestrial Planets (Inner Planets)</h2>
                <p>The four planets closest to the Sun are called terrestrial planets because they have solid, rocky surfaces. These are Mercury, Venus, Earth, and Mars.</p>
                
                <h3>Mercury</h3>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 4,880 km (~38% of Earth's)</li>
                    <li><strong>Mass:</strong> 3.3 × 10²³ kg (~0.055 times Earth's mass)</li>
                    <li><strong>Distance from Sun:</strong> ~57.9 million km (~0.39 AU)</li>
                    <li><strong>Surface Temperature:</strong> -173°C to 427°C</li>
                </ul>

                <h3>Venus</h3>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 12,104 km (~95% of Earth's)</li>
                    <li><strong>Mass:</strong> 4.87 × 10²⁴ kg (~0.82 times Earth's mass)</li>
                    <li><strong>Distance from Sun:</strong> ~108.2 million km (~0.72 AU)</li>
                    <li><strong>Surface Temperature:</strong> ~462°C (hottest planet)</li>
                </ul>

                <h3>Earth</h3>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 12,742 km</li>
                    <li><strong>Mass:</strong> 5.97 × 10²⁴ kg</li>
                    <li><strong>Distance from Sun:</strong> ~149.6 million km (1 AU)</li>
                    <li><strong>Surface Temperature:</strong> -88°C to 58°C</li>
                </ul>

                <h3>Mars</h3>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 6,779 km (~53% of Earth's)</li>
                    <li><strong>Mass:</strong> 6.42 × 10²³ kg (~0.11 times Earth's mass)</li>
                    <li><strong>Distance from Sun:</strong> ~227.9 million km (~1.52 AU)</li>
                    <li><strong>Surface Temperature:</strong> -87°C to -5°C</li>
                </ul>

                <h2>Gas Giants (Outer Planets)</h2>
                <p>The outer planets—Jupiter, Saturn, Uranus, and Neptune—are much larger than the inner planets and are composed mainly of hydrogen and helium.</p>

                <h3>Jupiter</h3>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 139,820 km (~11 times Earth's)</li>
                    <li><strong>Mass:</strong> 1.898 × 10²⁷ kg (~318 times Earth's mass)</li>
                    <li><strong>Distance from Sun:</strong> ~778.5 million km (~5.2 AU)</li>
                    <li><strong>Surface Temperature:</strong> -108°C</li>
                </ul>

                <h3>Saturn</h3>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 116,460 km (~9.5 times Earth's)</li>
                    <li><strong>Mass:</strong> 5.68 × 10²⁶ kg (~95 times Earth's mass)</li>
                    <li><strong>Distance from Sun:</strong> ~1.43 billion km (~9.58 AU)</li>
                    <li><strong>Surface Temperature:</strong> -139°C</li>
                </ul>

                <h3>Uranus</h3>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 50,724 km (~4 times Earth's)</li>
                    <li><strong>Mass:</strong> 8.68 × 10²⁵ kg (~14.5 times Earth's mass)</li>
                    <li><strong>Distance from Sun:</strong> ~2.87 billion km (~19.22 AU)</li>
                    <li><strong>Surface Temperature:</strong> -197°C</li>
                </ul>

                <h3>Neptune</h3>
                <ul className="info-list">
                    <li><strong>Diameter:</strong> 49,244 km (~3.9 times Earth's)</li>
                    <li><strong>Mass:</strong> 1.02 × 10²⁶ kg (~17 times Earth's mass)</li>
                    <li><strong>Distance from Sun:</strong> ~4.5 billion km (~30.07 AU)</li>
                    <li><strong>Surface Temperature:</strong> -201°C</li>
                </ul>

                <p className="nasa-link">
                    For a deeper comparison of the planets, visit <a href="https://solarsystem.nasa.gov/planet-compare/" target="_blank" rel="noopener noreferrer">NASA's Solar System Comparison Tool</a>.
                </p>
            </div>
        </div>
    );
}

export default Learn;

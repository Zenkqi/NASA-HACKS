// src/components/SolarSystem.jsx

// Import necessary libraries and components
import * as THREE from 'three';
import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// Import your custom functions or components here
// Ensure these imports are correct based on your project structure
// import getRocket from '../solar-system/getRocket';
import getSun from '../solar-system/getSun';
import getNebula from '../solar-system/getNebula';
import getStarfield from '../solar-system/getStarfield';
import getPlanet from '../solar-system/getPlanet';
import getAsteroidBelt from '../solar-system/getAsteroidBelt';

import Planet from './Planet';

// Custom hook to get the previous value of a state
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Rocket = (props) => {
  const { scene } = useGLTF('/public/saturn_v/scene.gltf');
  const rocketRef = useRef();

  useFrame(() => {
    rocketRef.current.rotation.y += 0.01;
  });
  return <primitive ref={rocketRef} object={scene} scale={[0,0,0]} position={[0,0,0]} rotation={[0,0,0]} {...props} />;
};

const SolarSystem = ({ setSelectedObject }) => {
  const [objs, setObjs] = useState([]);
  const solarSystemRef = useRef();

  // Sun's position
  const sunRef = useRef();
  const sunPosition = new THREE.Vector3(0, 0, 0);

  const rocketRef = useRef();
  

  // filters
  const [sizeFilter, setSizeFilter] = useState(0);

  // Load asteroid objects using OBJLoader
  useEffect(() => {
    const manager = new THREE.LoadingManager();
    const loader = new OBJLoader(manager);
    const loadedObjs = [];

    const objNames = ['Rock1', 'Rock2', 'Rock3']; // Update these names
    objNames.forEach((name) => {
      let path = `./rocks/${name}.obj`; // Ensure the path is correct
      loader.load(
        path,
        (obj) => {
          obj.traverse((child) => {
            if (child.isMesh) {
              loadedObjs.push(child);
            }
          });
        },
        undefined,
        (error) => {
          console.error(`Error loading ${path}:`, error);
        }
      );
    });
    manager.onLoad = () => {
        setObjs(loadedObjs);
      };


  }, []);

  // Memoize planet objects to prevent re-creation on every render
  const mercury = useMemo(() => getPlanet({ size: 0.1, img: 'mercury.png' }), []);
  const venus = useMemo(() => getPlanet({ size: 0.2, img: 'venus.png' }), []);
  const moonObj = useMemo(() => getPlanet({ size: 0.02, img: 'moon.png' }), []);
  const earthObj = useMemo(() => getPlanet({ size: 0.2, img: 'earth.png' }), []);
  const mars = useMemo(() => getPlanet({ size: 0.15, img: 'mars.png' }), []);
  const jupiter = useMemo(() => getPlanet({ size: 0.45, img: 'jupiter.png' }), []);
  const saturn = useMemo(() => getPlanet({ size: 0.4, img: 'saturn.png', ring: true }), []);
  const uranus = useMemo(() => getPlanet({ size: 0.3, img: 'uranus.png' }), []);
  const neptune = useMemo(() => getPlanet({ size: 0.2, img: 'neptune.png' }), []);

  // Memoize other objects to prevent re-creation
  const sun = useMemo(() => getSun('../../textures/sun.png'), []);
  const asteroidBelt = useMemo(() => getAsteroidBelt(objs), [objs]);
  // const elipticLines = useMemo(() => getElipticLines(), []);
  const starfield = useMemo(() => getStarfield({ numStars: 500, size: 0.35 }), []);
  const nebula1 = useMemo(
    () =>
      getNebula({
        hue: 0.6,
        numSprites: 10,
        opacity: 0.1,
        radius: 400,
        size: 800,
        z: -500.5,
      }),
    []
  );
  const nebula2 = useMemo(
    () =>
      getNebula({
        hue: 0.0,
        numSprites: 10,
        opacity: 0.1,
        radius: 400,
        size: 800,
        z: 500.5,
      }),
    []
  );

  // Refs for planets and moon
  const earthRef = useRef();
  const moonRef = useRef();

  // Define the planets and their orbital properties
  const planets = [
    {
      obj: mercury,
      speed: 2.75,
      size: 0.1,
      distanceX: 1.25 * 2,
      distanceZ: 1.25 * 3,
      name: 'Mercury',
      info: 'Mercury is the closest planet to the Sun.',
      distanceFromSun: '0.4 AU (58 million km)',
      composition: 'Mercury is a rocky planet with a solid, cratered surface.',
      rotationDetails: "One Mercury Day: 1416 hours or 59 Earth days",
      orbitDetails: 'Orbit Duration: 88 Earth days.',
    },
    {
      obj: venus,
      speed: 1.6,
      size: 0.2,
      distanceX: 2.5 * 2,
      distanceZ: 2.5 * 3,
      name: 'Venus',
      info: 'Venus is the second planet from the Sun.',
      distanceFromSun: '0.72 AU (108 million km)',
      composition: 'Venus has a thick atmosphere composed mainly of carbon dioxide.',
      rotationDetails: "One Venus Day: 5832 hours or 243 earth days",
      orbitDetails: 'Orbit Duration: 225 Earth Days.',
    },
    {
      obj: earthObj,
      speed: 1.0,
      size: 0.225,
      distanceX: 3.1 * 2,
      distanceZ: 3.1 * 3,
      name: 'Earth',
      info: 'Earth is our home planet.',
      distanceFromSun: '1 AU (~150 million km)',
      composition: 'Earth has a diverse composition with oceans, continents, and an atmosphere.',
      rotationDetails: "One Earth Day: 24 hours",
      orbitDetails: 'Orbit Duration: 365.25 Earth days.',
      ref: earthRef,
    },
    {
      obj: mars,
      speed: 0.531,
      size: 0.15,
      distanceX: 3.8 * 2,
      distanceZ: 3.8 * 3,
      name: 'Mars',
      info: 'Mars is the fourth planet from the Sun.',
      distanceFromSun: '1.5 AU (228 million km)',
      composition: 'Mars is known as the Red Planet due to its iron oxide-rich surface.',
      rotationDetails: "One Mars Day: 24.6 hours",
      orbitDetails: 'Orbit Duration: 687 Earth days.',
    },
    {
      obj: jupiter,
      speed: 0.1,
      size: 0.4,
      distanceX: 7.5 * 2,
      distanceZ: 7.5 * 3,
      name: 'Jupiter',
      info: 'Jupiter is the largest planet in the Solar System.',
      distanceFromSun: '5.2 AU (778 million km)',
      composition: 'Jupiter is a gas giant composed mainly of hydrogen and helium.',
      rotationDetails: "One Jupiter Day: 10 hours",
      orbitDetails: 'Orbit Duration: 4333 Earth days or 12 Earth years.',
    },
    {
      obj: saturn,
      speed: 0.075,
      size: 0.35,
      distanceX: 9.5 * 2,
      distanceZ: 9.5 * 3,
      name: 'Saturn',
      info: 'Saturn is known for its prominent ring system.',
      distanceFromSun: '9.5 AU (1.4 billion km)',
      composition: 'Saturn is a gas giant composed mainly of hydrogen and helium.',
      rotationDetails: "One Saturn Day: 10.7 hours",
      orbitDetails: 'Orbit Duration: 10,756 Earth days or 29.4 Earth years.',
      ring: true,
    },
    {
      obj: uranus,
      speed: 0.047,
      size: 0.3,
      distanceX: 9 * 2,
      distanceZ: 9 * 3,
      name: 'Uranus',
      info: 'Uranus is an ice giant with a unique tilt.',
      distanceFromSun: '19 AU (2.9 billion km)',
      composition: 'Uranus has an atmosphere of hydrogen, helium, and methane.',
      rotationDetails: 'One Uranus Day: 17 hours',
      orbitDetails: 'Orbit Duration: 30,687 Earth days or 84 Earth years',
    },
    {
      obj: neptune,
      speed: 0.0422,
      size: 0.3,
      distanceX: 14.5 * 2,
      distanceZ: 14.5 * 3,
      name: 'Neptune',
      info: 'Neptune is the farthest known planet from the Sun in the Solar System.',
      distanceFromSun: '30 AU (4.5 billion km)',
      composition: 'Neptune is an ice giant with a composition similar to Uranus.',
      rotationDetails: "One Neptune Day: 16 hours",
      orbitDetails: 'Orbit Duration: 60,190 days or 165 Earth Years.',
    },
    // Add the moon as a planet with isMoon set to true
    {
      obj: moonObj,
      speed: 1.0, // Speed of the moon's orbit around Earth
      size: 0.075,
      distanceX: 0.5, // Distance from Earth
      distanceZ: 0.6,
      name: 'Moon',
      info: 'The Moon is Earth’s only natural satellite.',
      composition: 'The Moon is a rocky body covered with craters.',
      orbitDetails: 'The Moon orbits Earth every 27.3 days.',
      isMoon: true,
      parentRef: earthRef, // Reference to Earth
      ref: moonRef,
    },

  ];

  // Animate asteroid belt
  useFrame(() => {
    if (asteroidBelt) {
      asteroidBelt.rotation.y += 0.001; // Adjust speed as needed
    }
  });

  return (
    <group ref={solarSystemRef}>
      
      {planets.map((planet, index) => (
        planet.size > sizeFilter ? (
        <Planet
          key={index}
          planet={planet}
          sunPosition={sunPosition}
          setSelectedObject={setSelectedObject}
          ref={planet.ref}
        />) : (<></>))
      )}
      <primitive object={asteroidBelt} />
      <primitive object={sun} ref={sunRef} />
      <primitive object={starfield} />
      <primitive object={nebula1} />
      <primitive object={nebula2} />
      <Rocket 
        scale={[.006,.006,.006]}
        position={[1,-1,1]} 
        rotation={[-Math.PI/2,-Math.PI/4,0]}
      />
    </group>
  );
};


export default SolarSystem;
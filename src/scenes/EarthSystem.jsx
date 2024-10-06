// src/components/EarthSystem.jsx

import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Import your custom functions or components here
import getSun from '../solar-system/getSun';
import getStarfield from '../solar-system/getStarfield';
import getPlanet from '../solar-system/getPlanet';

import Planet from './Planet';

const EarthSystem = ({ setSelectedObject }) => {
  const [objs, setObjs] = useState([]);
  const earthSystemRef = useRef();

  // Sun's position
  const earthRef = useRef();
  const earthPosition = new THREE.Vector3(0, 0, 0);
  
  // Memoize planet objects to prevent re-creation on every render
  const moon = useMemo(() => getPlanet({ size: 0.1, img: 'moon.png' }), []);

  // Memoize other objects to prevent re-creation
  const earth = useMemo(() => getSun('../../textures/earth.png', false), []);
  const starfield = useMemo(() => getStarfield({ numStars: 500, size: 0.35 }), []);

  // Refs for planets and moon
  const moonRef = useRef();

  // Define the planets and their orbital properties
  const nearEarthObjs = [
    {
      obj: moon,
      speed: 1.0, // Speed of the moon's orbit around Earth
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

  return (
    <group ref={earthSystemRef}>
      {nearEarthObjs.map((nearEarthObj, index) => (
        <Planet
          key={index}
          planet={nearEarthObj}
          sunPosition={earthPosition}
          setSelectedObject={setSelectedObject}
          ref={nearEarthObjs.ref}
        />
      ))}
      <primitive object={starfield} />
      <primitive object={earth} ref={earthRef} />
    </group>
  );
};

export default EarthSystem;
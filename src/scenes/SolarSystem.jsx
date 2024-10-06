// src/components/SolarSystem.jsx

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Import your custom functions or components here
import getSun from '../solar-system/getSun';
import getNebula from '../solar-system/getNebula';
import getStarfield from '../solar-system/getStarfield';
import getPlanet from '../solar-system/getPlanet';
import getAsteroidBelt from '../solar-system/getAsteroidBelt';

import Planet from './Planet';

const SolarSystem = ({ setSelectedObject }) => {
  const [objs, setObjs] = useState([]);
  const solarSystemRef = useRef();

  // Sun's position
  const sunRef = useRef();
  const sunPosition = new THREE.Vector3(0, 0, 0);

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
  const moonObj = useMemo(() => getPlanet({ size: 0.075, img: 'moon.png' }), []);
  const earthObj = useMemo(() => getPlanet({ size: 0.225, img: 'earth.png' }), []);
  const mars = useMemo(() => getPlanet({ size: 0.15, img: 'mars.png' }), []);
  const jupiter = useMemo(() => getPlanet({ size: 0.4, img: 'jupiter.png' }), []);
  const saturn = useMemo(() => getPlanet({ size: 0.35, img: 'saturn.png', ring: true }), []);
  const uranus = useMemo(() => getPlanet({ size: 0.3, img: 'uranus.png' }), []);
  const neptune = useMemo(() => getPlanet({ size: 0.3, img: 'neptune.png' }), []);

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
        opacity: 0.2,
        radius: 40,
        size: 80,
        z: -50.5,
      }),
    []
  );
  const nebula2 = useMemo(
    () =>
      getNebula({
        hue: 0.0,
        numSprites: 10,
        opacity: 0.2,
        radius: 40,
        size: 80,
        z: 50.5,
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
      speed: 0.4,
      distanceX: 1.25 * 2,
      distanceZ: 1.25 * 3,
      name: 'Mercury',
      info: 'Mercury is the closest planet to the Sun.',
      composition: 'Mercury is a rocky planet with a solid, cratered surface.',
      orbitDetails: 'Mercury has the shortest orbit around the Sun at 88 Earth days.',
    },
    {
      obj: venus,
      speed: 0.3,
      distanceX: 1.65 * 2,
      distanceZ: 1.65 * 3,
      name: 'Venus',
      info: 'Venus is the second planet from the Sun.',
      composition: 'Venus has a thick atmosphere composed mainly of carbon dioxide.',
      orbitDetails: 'Venus orbits the Sun every 225 Earth days.',
    },
    {
      obj: earthObj,
      speed: 0.2,
      distanceX: 2.0 * 2,
      distanceZ: 2.0 * 3,
      name: 'Earth',
      info: 'Earth is our home planet.',
      composition: 'Earth has a diverse composition with oceans, continents, and an atmosphere.',
      orbitDetails: 'Earth orbits the Sun every 365.25 days.',
      ref: earthRef,
    },
    {
      obj: mars,
      speed: 0.17,
      distanceX: 2.25 * 2,
      distanceZ: 2.25 * 3,
      name: 'Mars',
      info: 'Mars is the fourth planet from the Sun.',
      composition: 'Mars is known as the Red Planet due to its iron oxide-rich surface.',
      orbitDetails: 'Mars takes about 687 Earth days to orbit the Sun.',
    },
    {
      obj: jupiter,
      speed: 0.1,
      distanceX: 2.75 * 2,
      distanceZ: 2.75 * 3,
      name: 'Jupiter',
      info: 'Jupiter is the largest planet in the Solar System.',
      composition: 'Jupiter is a gas giant composed mainly of hydrogen and helium.',
      orbitDetails: 'Jupiter takes about 12 Earth years to orbit the Sun.',
    },
    {
      obj: saturn,
      speed: 0.083,
      distanceX: 3.25 * 2,
      distanceZ: 3.25 * 3,
      name: 'Saturn',
      info: 'Saturn is known for its prominent ring system.',
      composition: 'Saturn is a gas giant composed mainly of hydrogen and helium.',
      orbitDetails: 'Saturn takes about 29 Earth years to orbit the Sun.',
      ring: true,
    },
    {
      obj: uranus,
      speed: 0.047,
      distanceX: 3.75 * 2,
      distanceZ: 3.75 * 3,
      name: 'Uranus',
      info: 'Uranus is an ice giant with a unique tilt.',
      composition: 'Uranus has an atmosphere of hydrogen, helium, and methane.',
      orbitDetails: 'Uranus takes about 84 Earth years to orbit the Sun.',
    },
    {
      obj: neptune,
      speed: 0.038,
      distanceX: 4.25 * 2,
      distanceZ: 4.25 * 3,
      name: 'Neptune',
      info: 'Neptune is the farthest known planet from the Sun in the Solar System.',
      composition: 'Neptune is an ice giant with a composition similar to Uranus.',
      orbitDetails: 'Neptune takes about 165 Earth years to orbit the Sun.',
    },
    // Add the moon as a planet with isMoon set to true
    {
      obj: moonObj,
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

  // Animate asteroid belt
  useFrame(() => {
    if (asteroidBelt) {
      asteroidBelt.rotation.y += 0.001; // Adjust speed as needed
    }
  });

  return (
    <group ref={solarSystemRef}>
      {planets.map((planet, index) => (
        <Planet
          key={index}
          planet={planet}
          sunPosition={sunPosition}
          setSelectedObject={setSelectedObject}
          ref={planet.ref}
        />
      ))}
      <primitive object={asteroidBelt} />
      <primitive object={sun} ref={sunRef} />
      <primitive object={starfield} />
      <primitive object={nebula1} />
      <primitive object={nebula2} />
    </group>
  );
};

export default SolarSystem;
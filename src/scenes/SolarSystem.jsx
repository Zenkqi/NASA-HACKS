import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import getSun from '../solar-system/getSun';
import getNebula from '../solar-system/getNebula';
import getStarfield from '../solar-system/getStarfield';
import getPlanet from '../solar-system/getPlanet';
import getAsteroidBelt from '../solar-system/getAsteroidBelt';
import getElipticLines from '../solar-system/getElipticLines';

const Planet = ({ planet, sunPosition, setSelectedPlanet }) => {
  const { obj, name, info, speed, distance } = planet;
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const elapsed = clock.getElapsedTime();
      const x = sunPosition.x + Math.cos(elapsed * speed) * distance;
      const y = sunPosition.y + Math.sin(elapsed * speed) * distance;
      ref.current.position.x = x;
      ref.current.position.y = y;
      ref.current.position.z = 0;
    }
  });

  return (
    <group ref={ref} onClick={() => setSelectedPlanet({ name, info })} cursor="pointer">
      <primitive object={obj} />
    </group>
  );
};

const SolarSystem = ({ setSelectedPlanet }) => {
  const [objs, setObjs] = useState([]);
  const solarSystemRef = useRef();

  // Stars
  const sunRef = useRef();
  const sunPosition = new THREE.Vector3(0, 0, 0);

  // Load objects using OBJLoader
  useEffect(() => {
    const manager = new THREE.LoadingManager();
    const loader = new OBJLoader(manager);
    const loadedObjs = [];

    const objNames = ['Rock1', 'Rock2', 'Rock3'];
    objNames.forEach((name) => {
      let path = `./rocks/${name}.obj`;
      loader.load(path, (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            loadedObjs.push(child);
          }
        });
      });
    });

    manager.onLoad = () => {
      setObjs(loadedObjs);
    };
  }, []);

  // Memoize planet objects to prevent re-creation on every render
  const mercury = useMemo(() => getPlanet({ size: 0.1, distance: 1.25, img: 'mercury.png' }), []);
  const venus = useMemo(() => getPlanet({ size: 0.2, distance: 1.65, img: 'venus.png' }), []);
  const moon = useMemo(() => getPlanet({ size: 0.075, distance: 0.4, img: 'moon.png' }), []);
  const earth = useMemo(
    () => getPlanet({ children: [moon], size: 0.225, distance: 2.0, img: 'earth.png' }),
    [moon]
  );
  const mars = useMemo(() => getPlanet({ size: 0.15, distance: 2.25, img: 'mars.png' }), []);
  const jupiter = useMemo(() => getPlanet({ size: 0.4, distance: 2.75, img: 'jupiter.png' }), []);

  // Memoize other objects to prevent re-creation
  const sun = useMemo(() => getSun(), []);
  const asteroidBelt = useMemo(() => getAsteroidBelt(objs), [objs]);
  const elipticLines = useMemo(() => getElipticLines(), []);
  const starfield = useMemo(() => getStarfield({ numStars: 500, size: 0.35 }), []);
  const nebula1 = useMemo(
    () => getNebula({ hue: 0.6, numSprites: 10, opacity: 0.2, radius: 40, size: 80, z: -50.5 }),
    []
  );
  const nebula2 = useMemo(
    () => getNebula({ hue: 0.0, numSprites: 10, opacity: 0.2, radius: 40, size: 80, z: 50.5 }),
    []
  );

  // Define the planets and their orbital properties
  const planets = [
    {
      obj: mercury,
      speed: 0.4,
      distance: 1.25,
      name: 'Mercury',
      info: 'Mercury is the closest planet to the Sun.',
    },
    {
      obj: venus,
      speed: 0.3,
      distance: 1.65,
      name: 'Venus',
      info: 'Venus is the second planet from the Sun.',
    },
    {
      obj: earth,
      speed: 0.2,
      distance: 2.0,
      name: 'Earth',
      info: 'Earth is our home planet.',
    },
    {
      obj: mars,
      speed: 0.17,
      distance: 2.25,
      name: 'Mars',
      info: 'Mars is the fourth planet from the Sun.',
    },
    {
      obj: jupiter,
      speed: 0.1,
      distance: 2.75,
      name: 'Jupiter',
      info: 'Jupiter is the largest planet in the Solar System.',
    },
  ];

  // Animate asteroid belt
  useFrame(() => {
    if (asteroidBelt) {
      asteroidBelt.rotation.y += 0.0001; // Adjust the speed as needed
    }
  });

  return (
    <group ref={solarSystemRef}>
      {planets.map((planet, index) => (
        <Planet
          key={index}
          planet={planet}
          sunPosition={sunPosition}
          setSelectedPlanet={setSelectedPlanet}
        />
      ))}
      <primitive object={asteroidBelt} />
      <primitive object={elipticLines} />
      <primitive object={sun} ref={sunRef} />
      <primitive object={starfield} />
      <primitive object={nebula1} />
      <primitive object={nebula2} />
    </group>
  );
};

const Scene = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', backgroundColor: 'black' }}>
      <Canvas camera={{ position: [0, 2.5, 4], fov: 75 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight />
        <directionalLight position={[0, 1, 0]} intensity={1} color={0x0099ff} />
        <OrbitControls enableDamping dampingFactor={0.1} rotateSpeed={0.7} enableZoom={true} enablePan={true} />
        <Suspense fallback={null}>
          {/* Pass setSelectedPlanet to SolarSystem */}
          <SolarSystem setSelectedPlanet={setSelectedPlanet} />
        </Suspense>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      </Canvas>
      {/* Render dropdown menu when a planet is selected */}
      {selectedPlanet && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <h3>{selectedPlanet.name}</h3>
          <p>{selectedPlanet.info}</p>
          <select>
            <option value="overview">Overview</option>
            <option value="composition">Composition</option>
            <option value="orbit">Orbit Details</option>
            {/* Add more options as needed */}
          </select>
          <button onClick={() => setSelectedPlanet(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Scene;
import React, { Suspense, useRef, useState, useEffect } from 'react';
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

const SolarSystem = () => {
  const [objs, setObjs] = useState([]);
  const solarSystemRef = useRef();
  
  const planetRefs = useRef({
    mercury: useRef(),
    venus: useRef(),
    earth: useRef(),
    mars: useRef(),
    jupiter: useRef(),
  });

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

  // Define planets as Three.js objects
  const mercury = getPlanet({ size: 0.1, distance: 1.25, img: 'mercury.png' });
  const venus = getPlanet({ size: 0.2, distance: 1.65, img: 'venus.png' });
  const moon = getPlanet({ size: 0.075, distance: 0.4, img: 'moon.png' });
  const earth = getPlanet({ children: [moon], size: 0.225, distance: 2.0, img: 'earth.png' });
  const mars = getPlanet({ size: 0.15, distance: 2.25, img: 'mars.png' });
  const jupiter = getPlanet({ size: 0.4, distance: 2.75, img: 'jupiter.png' });

  // Reference each planet so we can animate it
  const planets = [
    { ref: planetRefs.current.mercury, obj: mercury, speed: 0.4, distance: 1.25 },
    { ref: planetRefs.current.venus, obj: venus, speed: 0.3, distance: 1.65 },
    { ref: planetRefs.current.earth, obj: earth, speed: 0.2, distance: 2.0 },
    { ref: planetRefs.current.mars, obj: mars, speed: 0.17, distance: 2.25 },
    { ref: planetRefs.current.jupiter, obj: jupiter, speed: 0.1, distance: 2.75 },
  ];

  // Animate planets in their orbits using `useFrame`
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    
    planets.forEach(({ ref, speed, distance }) => {
      if (ref.current) {
        ref.current.position.x = Math.cos(elapsed * speed) * distance;
        ref.current.position.z = Math.sin(elapsed * speed) * distance;
      }
    });
  });

  return (
    <group ref={solarSystemRef}>
      {planets.map(({ ref, obj }, index) => (
        <primitive key={index} object={obj} ref={ref} />
      ))}
      <primitive object={getAsteroidBelt(objs)} />
      <primitive object={getElipticLines()} />
      <primitive object={getSun()} />
      <primitive object={getStarfield({ numStars: 500, size: 0.35 })} />
      <primitive object={getNebula({ hue: 0.6, numSprites: 10, opacity: 0.2, radius: 40, size: 80, z: -50.5 })} />
      <primitive object={getNebula({ hue: 0.0, numSprites: 10, opacity: 0.2, radius: 40, size: 80, z: 50.5 })} />
    </group>
  );
};

const Scene = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: 'black' }}>
      <Canvas camera={{ position: [0, 2.5, 4], fov: 75 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight />
        <directionalLight position={[0, 1, 0]} intensity={1} color={0x0099ff} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.1} 
          rotateSpeed={0.7} 
          enableZoom={true} 
          enablePan={true} 
        />
        <Suspense fallback={null}>
          <SolarSystem />
        </Suspense>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      </Canvas>
    </div>
  );
};

export default Scene;

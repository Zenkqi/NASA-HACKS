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

const SolarSystem = ({ onPlanetClick }) => {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [objs, setObjs] = useState([]);
  const solarSystemRef = useRef();

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

  const solarSystemChildren = [mercury, venus, earth, mars, jupiter]; // Add other planets similarly

  // Animation loop using useFrame (inside Canvas)
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.1;
    const solarSystem = solarSystemRef.current;

    if (solarSystem) {
      solarSystem.children.forEach((child) => {
        if (child.userData.update) {
          child.userData.update(time);
        }
      });
    }

    // Animate the camera
    const cameraDistance = 5;
    state.camera.position.x = Math.cos(time * 0.75) * cameraDistance;
    state.camera.position.y = Math.cos(time * 0.75);
    state.camera.position.z = Math.sin(time * 0.75) * cameraDistance;
    state.camera.lookAt(0, 0, 0);
  });

  // Event handlers for interaction
  const handlePointerOver = (planet) => {
    setHoveredPlanet(planet);
  };

  const handlePointerOut = () => {
    setHoveredPlanet(null);
  };

  const handlePlanetClick = (planet) => {
    if (onPlanetClick) {
      onPlanetClick(planet);
    }
  };

  return (
    <group ref={solarSystemRef}>
      {solarSystemChildren.map((planet, index) => (
        <primitive
          key={index}
          object={planet}
          onPointerOver={() => handlePointerOver(planet)}
          onPointerOut={handlePointerOut}
          onClick={() => handlePlanetClick(planet)}
          scale={hoveredPlanet === planet ? 1.2 : 1}
        />
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

const CameraController = ({ selectedPlanet }) => {
  const cameraRef = useRef();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const smoothingFactor = 0.1;

  useFrame(() => {
    if (selectedPlanet && cameraRef.current) {
      // Get current camera position and target
      const currentPos = cameraRef.current.position;
      const targetPos = new THREE.Vector3(
        selectedPlanet.position.x, 
        selectedPlanet.position.y, 
        selectedPlanet.position.z + 1
      );

      // Smooth the camera movement
      currentPos.lerp(targetPos, smoothingFactor);

      // Set camera's look-at position (smoothing the look-at target too)
      targetRef.current.lerp(selectedPlanet.position, smoothingFactor);
      cameraRef.current.lookAt(targetRef.current);
    }
  });

  return null;
};


const Scene = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: 'black' }}>
      <Canvas camera={{ position: [0, 2.5, 4], fov: 75 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight />
        <directionalLight position={[0, 1, 0]} intensity={1} color={0x0099ff} />
        <OrbitControls enableDamping dampingFactor={0.03} />
        <Suspense fallback={null}>
          <SolarSystem onPlanetClick={handlePlanetClick} />
          <CameraController selectedPlanet={selectedPlanet} />
        </Suspense>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      </Canvas>
    </div>
  );
};

export default Scene;

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// Import your custom functions or components here
// Ensure these imports are correct based on your project structure
import getSun from '../solar-system/getSun';
import getNebula from '../solar-system/getNebula';
import getStarfield from '../solar-system/getStarfield';
import getPlanet from '../solar-system/getPlanet';
import getAsteroidBelt from '../solar-system/getAsteroidBelt';
import getElipticLines from '../solar-system/getElipticLines';

// Custom hook to get the previous value of a state
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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
    <group
      ref={ref}
      onClick={() => {
        setSelectedPlanet({ name, info, ref });
      }}
      cursor="pointer"
    >
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

  // Load asteroid objects using OBJLoader
  useEffect(() => {
    const manager = new THREE.LoadingManager();
    const loader = new OBJLoader(manager);
    const loadedObjs = [];

    const objNames = ['Rock1', 'Rock2', 'Rock3']; // Update these names based on your actual OBJ files
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
  const moon = useMemo(() => getPlanet({ size: 0.075, img: 'moon.png' }), []);
  const earth = useMemo(
    () => getPlanet({ children: [moon], size: 0.225, img: 'earth.png' }),
    [moon]
  );
  const mars = useMemo(() => getPlanet({ size: 0.15, img: 'mars.png' }), []);
  const jupiter = useMemo(() => getPlanet({ size: 0.4, img: 'jupiter.png' }), []);

  // Memoize other objects to prevent re-creation
  const sun = useMemo(() => getSun(), []);
  const asteroidBelt = useMemo(() => getAsteroidBelt(objs), [objs]);
  const elipticLines = useMemo(() => getElipticLines(), []);
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
      asteroidBelt.rotation.y += 0.001; // Adjust the speed as needed
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

const CameraAnimation = ({ selectedPlanet, setSelectedPlanet, controlsRef }) => {
  const { camera } = useThree();

  // Store initial and target positions
  const initialCameraPosition = useRef(camera.position.clone());
  const initialTarget = useRef(controlsRef.current ? controlsRef.current.target.clone() : new THREE.Vector3());
  const targetCameraPosition = useRef(new THREE.Vector3());
  const targetTarget = useRef(new THREE.Vector3());

  // Animation state
  const [zoomState, setZoomState] = useState('idle'); // 'idle', 'zoomingIn', 'zoomingOut'
  const zoomProgress = useRef(0);
  const animationDuration = 1.0; // seconds
  const clock = useRef(new THREE.Clock());

  const prevSelectedPlanet = usePrevious(selectedPlanet);

  // Handle Escape key to reset the camera
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (zoomState === 'idle' && selectedPlanet) {
          setSelectedPlanet(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlanet, zoomState, setSelectedPlanet]);

  // Start zoom-in animation when a planet is selected
  useEffect(() => {
    if (
      selectedPlanet &&
      prevSelectedPlanet !== selectedPlanet &&
      controlsRef.current &&
      zoomState === 'idle'
    ) {
      // Store initial camera position and target
      initialCameraPosition.current.copy(camera.position);
      initialTarget.current.copy(controlsRef.current.target);

      // Get the planet's position
      const planetPosition = selectedPlanet.ref.current.getWorldPosition(new THREE.Vector3());

      // Calculate desired camera position (closer to the planet)
      const offset = new THREE.Vector3(0, 0.5, 1.5); // Adjust offset to zoom in closer
      const desiredPosition = planetPosition.clone().add(offset);

      // Set target positions for zoom-in
      targetCameraPosition.current.copy(desiredPosition);
      targetTarget.current.copy(planetPosition);

      // Start zoom-in animation
      setZoomState('zoomingIn');
      zoomProgress.current = 0;
      clock.current.start();

      // Disable controls during animation
      controlsRef.current.enabled = false;
    }
  }, [selectedPlanet, prevSelectedPlanet, zoomState, camera, controlsRef]);

  // Start zoom-out animation when selectedPlanet becomes null
  useEffect(() => {
    if (
      !selectedPlanet &&
      prevSelectedPlanet &&
      controlsRef.current &&
      zoomState === 'idle'
    ) {
      // Swap initial and target positions for zoom-out
      const tempPosition = initialCameraPosition.current.clone();
      initialCameraPosition.current.copy(camera.position);
      targetCameraPosition.current.copy(tempPosition);

      const tempTarget = initialTarget.current.clone();
      initialTarget.current.copy(controlsRef.current.target);
      targetTarget.current.copy(tempTarget);

      // Start zoom-out animation
      setZoomState('zoomingOut');
      zoomProgress.current = 0;
      clock.current.start();

      // Disable controls during animation
      controlsRef.current.enabled = false;
    }
  }, [selectedPlanet, prevSelectedPlanet, zoomState, camera, controlsRef]);

  useFrame(() => {
    if (zoomState === 'zoomingIn' || zoomState === 'zoomingOut') {
      const delta = clock.current.getDelta();
      zoomProgress.current += delta / animationDuration;

      if (zoomProgress.current >= 1) {
        zoomProgress.current = 1;

        // Re-enable controls after animation
        if (controlsRef.current) {
          controlsRef.current.enabled = zoomState === 'zoomingOut';
          controlsRef.current.update();
        }

        setZoomState('idle');
      }

      // Interpolate camera position and target
      camera.position.lerpVectors(
        initialCameraPosition.current,
        targetCameraPosition.current,
        zoomProgress.current
      );

      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(
          initialTarget.current,
          targetTarget.current,
          zoomProgress.current
        );
        controlsRef.current.update();
      }

      camera.lookAt(controlsRef.current ? controlsRef.current.target : new THREE.Vector3());
    }
  });

  return null;
};

const Scene = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const controlsRef = useRef();

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
      }}
    >
      <Canvas
        camera={{ position: [0, 2.5, 4], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight />
        <directionalLight position={[0, 1, 0]} intensity={1} color={0x0099ff} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.7}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
        />
        <Suspense fallback={null}>
          <SolarSystem setSelectedPlanet={setSelectedPlanet} />
        </Suspense>
        <CameraAnimation
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={setSelectedPlanet}
          controlsRef={controlsRef}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      </Canvas>
      {/* Render infobox in the center of the screen when a planet is selected */}
      {selectedPlanet && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
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
          <button
            onClick={() => {
              setSelectedPlanet(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Scene;
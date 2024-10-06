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
import getElipticLines from '../solar-system/getElipticLines';


// Custom hook to get the previous value of a state
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Planet = ({ planet, sunPosition, setSelectedPlanet }) => {
  const { obj, name, info, speed, distance, composition, orbitDetails } = planet;
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const elapsed = clock.getElapsedTime();
      const x = sunPosition.x + Math.cos(elapsed * speed) * distance;
      const z = sunPosition.z + Math.sin(elapsed * speed) * distance;
      ref.current.position.x = x;
      ref.current.position.y = sunPosition.y;
      ref.current.position.z = z;
    }
  });

  return (
    <group
      ref={ref}
      onClick={() => {
        setSelectedPlanet({ name, info, composition, orbitDetails, ref });
      }}
      cursor="pointer"
    >
      <primitive object={obj} />
    </group>
  );
};
const Rocket = (props) => {
  const { scene } = useGLTF('/public/saturn_v/scene.gltf');
  const rocketRef = useRef();

  useFrame(() => {
    rocketRef.current.rotation.y += 0.01;
  });
  return <primitive ref={rocketRef} object={scene} scale={[0,0,0]} position={[0,0,0]} rotation={[0,0,0]} {...props} />;
};

const SolarSystem = ({ setSelectedPlanet }) => {
  const [objs, setObjs] = useState([]);
  const solarSystemRef = useRef();

  // Sun's position
  const sunRef = useRef();
  const sunPosition = new THREE.Vector3(0, 0, 0);
  const rocketRef = useRef();
  

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
  const earth = useMemo(() => getPlanet({ children: [moon], size: 0.225, img: 'earth.png' }),
    [moon]
  );
  
  const mars = useMemo(() => getPlanet({ size: 0.15, img: 'mars.png' }), []);
  const jupiter = useMemo(() => getPlanet({ size: 0.4, img: 'jupiter.png' }), []);
  const saturn = useMemo(() => getPlanet({ size: 0.35, img: 'saturn.png', ring: true }), []);
  const uranus = useMemo(() => getPlanet({ size: 0.3, img: 'uranus.png' }), []);
  const neptune = useMemo(() => getPlanet({ size: 0.3, img: 'neptune.png' }), []);

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
      composition: 'Mercury is a rocky planet with a solid, cratered surface.',
      orbitDetails: 'Mercury has the shortest orbit around the Sun at 88 Earth days.',
    },
    {
      obj: venus,
      speed: 0.3,
      distance: 1.65,
      name: 'Venus',
      info: 'Venus is the second planet from the Sun.',
      composition: 'Venus has a thick atmosphere composed mainly of carbon dioxide.',
      orbitDetails: 'Venus orbits the Sun every 225 Earth days.',
    },
    {
      obj: earth,
      speed: 0.2,
      distance: 2.0,
      name: 'Earth',
      info: 'Earth is our home planet.',
      composition: 'Earth has a diverse composition with oceans, continents, and an atmosphere.',
      orbitDetails: 'Earth orbits the Sun every 365.25 days.',
    },
    {
      obj: mars,
      speed: 0.17,
      distance: 2.25,
      name: 'Mars',
      info: 'Mars is the fourth planet from the Sun.',
      composition: 'Mars is known as the Red Planet due to its iron oxide-rich surface.',
      orbitDetails: 'Mars takes about 687 Earth days to orbit the Sun.',
    },
    {
      obj: jupiter,
      speed: 0.1,
      distance: 2.75,
      name: 'Jupiter',
      info: 'Jupiter is the largest planet in the Solar System.',
      composition: 'Jupiter is a gas giant composed mainly of hydrogen and helium.',
      orbitDetails: 'Jupiter takes about 12 Earth years to orbit the Sun.',
    },
    {
      obj: saturn,
      speed: 0.083,
      distance: 3.25,
      name: 'Saturn',
      info: 'Saturn is known for its prominent ring system.',
      composition: 'Saturn is a gas giant composed mainly of hydrogen and helium.',
      orbitDetails: 'Saturn takes about 29 Earth years to orbit the Sun.',
    },
    {
      obj: uranus,
      speed: 0.047,
      distance: 3.75,
      name: 'Uranus',
      info: 'Uranus is an ice giant with a unique tilt.',
      composition: 'Uranus has an atmosphere of hydrogen, helium, and methane.',
      orbitDetails: 'Uranus takes about 84 Earth years to orbit the Sun.',
    },
    {
      obj: neptune,
      speed: 0.038,
      distance: 4.25,
      name: 'Neptune',
      info: 'Neptune is the farthest known planet from the Sun in the Solar System.',
      composition: 'Neptune is an ice giant with a composition similar to Uranus.',
      orbitDetails: 'Neptune takes about 165 Earth years to orbit the Sun.',
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

  // Store positions for animations
  const zoomInOffset = new THREE.Vector3(0, 0.5, 1.5); // Adjust offset to zoom in closer
  const zoomOutCameraPosition = useRef(camera.position.clone());
  const zoomOutTarget = useRef(
    controlsRef.current ? controlsRef.current.target.clone() : new THREE.Vector3()
  );

  // Animation state
  const [zoomState, setZoomState] = useState('idle'); // 'idle', 'zoomingIn', 'following', 'zoomingOut'
  const zoomProgress = useRef(0);
  const animationDuration = 1.0; // seconds
  const clock = useRef(new THREE.Clock());

  const prevSelectedPlanet = usePrevious(selectedPlanet);

  

  // Handle Escape key to reset the camera
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if ((zoomState === 'following' || zoomState === 'idle') && selectedPlanet) {
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
      // Store the camera position and target before zoom-in
      zoomOutCameraPosition.current.copy(camera.position);
      zoomOutTarget.current.copy(controlsRef.current.target);

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
      (zoomState === 'following' || zoomState === 'idle')
    ) {
      // Start zoom-out animation
      setZoomState('zoomingOut');
      zoomProgress.current = 0;
      clock.current.start();

      // Disable controls during animation
      controlsRef.current.enabled = false;
    }
  }, [selectedPlanet, prevSelectedPlanet, zoomState, controlsRef]);

  useFrame(() => {
    const delta = clock.current.getDelta();

    if (zoomState === 'zoomingIn') {
      zoomProgress.current += delta / animationDuration;

      if (zoomProgress.current >= 1) {
        zoomProgress.current = 1;
        setZoomState('following');
        // Keep controls disabled while zoomed in
        if (controlsRef.current) {
          controlsRef.current.enabled = false;
        }
      }

      // Interpolate camera position and target
      const planetPosition = selectedPlanet.ref.current.getWorldPosition(new THREE.Vector3());
      const desiredPosition = planetPosition.clone().add(zoomInOffset);

      camera.position.lerpVectors(
        zoomOutCameraPosition.current,
        desiredPosition,
        zoomProgress.current
      );

      controlsRef.current.target.lerpVectors(
        zoomOutTarget.current,
        planetPosition,
        zoomProgress.current
      );

      camera.lookAt(planetPosition);
    } else if (zoomState === 'zoomingOut') {
      zoomProgress.current += delta / animationDuration;

      if (zoomProgress.current >= 1) {
        zoomProgress.current = 1;
        setZoomState('idle');

        // Re-enable controls after zoom-out
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
          controlsRef.current.update();
        }
      }

      // Interpolate camera position and target
      const startPlanetPosition = prevSelectedPlanet
        ? prevSelectedPlanet.ref.current.getWorldPosition(new THREE.Vector3())
        : new THREE.Vector3();

      const startPosition = startPlanetPosition.clone().add(zoomInOffset);

      camera.position.lerpVectors(
        startPosition,
        zoomOutCameraPosition.current,
        zoomProgress.current
      );

      controlsRef.current.target.lerpVectors(
        startPlanetPosition,
        zoomOutTarget.current,
        zoomProgress.current
      );

      camera.lookAt(controlsRef.current.target);
    } else if (zoomState === 'following' && selectedPlanet) {
      // After zoom-in animation completes, continuously update camera position to follow the planet
      const planetPosition = selectedPlanet.ref.current.getWorldPosition(new THREE.Vector3());
      const desiredPosition = planetPosition.clone().add(zoomInOffset);

      camera.position.copy(desiredPosition);
      controlsRef.current.target.copy(planetPosition);
      camera.lookAt(planetPosition);
    }
  });

  return null;
};

const Scene = () => {
  

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // New state for active tab
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
        
        <Rocket 
        scale={[.006,.006,.006]}
        position={[1,-1,1]} 
        rotation={[-Math.PI/2,-Math.PI/4,0]}
        />
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
      {/* Infobox */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          height: '100%',
          width: '300px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          transform: selectedPlanet ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s ease-in-out',
          boxShadow: '-2px 0 5px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedPlanet(null);
            setActiveTab('overview'); // Reset active tab
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            color: '#000',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        {selectedPlanet && (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #ccc', marginTop: '50px' }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: activeTab === 'overview' ? '#e0e0e0' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'overview' ? '2px solid #000' : 'none',
                  cursor: 'pointer',
                }}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('composition')}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: activeTab === 'composition' ? '#e0e0e0' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'composition' ? '2px solid #000' : 'none',
                  cursor: 'pointer',
                }}
              >
                Composition
              </button>
              <button
                onClick={() => setActiveTab('orbit')}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: activeTab === 'orbit' ? '#e0e0e0' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'orbit' ? '2px solid #000' : 'none',
                  cursor: 'pointer',
                }}
              >
                Orbit Details
              </button>
            </div>
            {/* Content */}
            <div style={{ padding: '10px', overflowY: 'auto', flex: 1 }}>
              <h2>{selectedPlanet.name}</h2>
              {activeTab === 'overview' && (
                <div>
                  <p>{selectedPlanet.info}</p>
                </div>
              )}
              {activeTab === 'composition' && (
                <div>
                  <p>{selectedPlanet.composition}</p>
                </div>
              )}
              {activeTab === 'orbit' && (
                <div>
                  <p>{selectedPlanet.orbitDetails}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Scene;
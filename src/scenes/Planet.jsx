// src/components/Planet.jsx

import React, { useRef, forwardRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import ringTextureImg from '/textures/saturn_ring.png'; // Adjust the path

const Planet = forwardRef(({ planet, sunPosition, setSelectedObject }, ref) => {
  const {
    obj,
    name,
    info,
    speed,
    distanceX,
    distanceZ,
    composition,
    orbitDetails,
    isMoon,
    parentRef,
    ring,
  } = planet;

  const localRef = useRef();
  const actualRef = ref || localRef;

  // Load the ring texture
  const ringTexture = useLoader(THREE.TextureLoader, ringTextureImg);

  useFrame(({ clock }) => {
    if (actualRef.current) {
      const elapsed = clock.getElapsedTime();

      if (isMoon && parentRef && parentRef.current) {
        // Moon orbiting around its parent planet
        const parentPosition = parentRef.current.position;
        const x = parentPosition.x + Math.cos(elapsed * speed) * distanceX;
        const z = parentPosition.z + Math.sin(elapsed * speed) * distanceZ;
        actualRef.current.position.x = x;
        actualRef.current.position.y = parentPosition.y; // Assuming same plane
        actualRef.current.position.z = z;
      } else {
        // Planet orbiting around the sun
        const x = sunPosition.x + Math.cos(elapsed * speed) * distanceX;
        const z = sunPosition.z + Math.sin(elapsed * speed) * distanceZ;
        actualRef.current.position.x = x;
        actualRef.current.position.y = sunPosition.y;
        actualRef.current.position.z = z;
      }
    }
  });

  return (
    <group
      ref={actualRef}
      onClick={(event) => {
        event.stopPropagation(); // Prevent click event from propagating to parent
        setSelectedObject({ name, info, composition, orbitDetails, ref: actualRef });
      }}
      cursor="pointer"
    >
      <primitive object={obj} />
      {/* Conditionally render rings if the ring property is true */}
      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.6, 64]} /> {/* Adjust sizes as needed */}
          <meshBasicMaterial
            map={ringTexture}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
});

export default Planet;
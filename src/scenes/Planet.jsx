// src/components/Planet.jsx

import React, { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Planet = forwardRef(({ planet, sunPosition, setSelectedObject }, ref) => {
  const {
    obj,
    name,
    info,
    speed,
    distance,
    composition,
    orbitDetails,
    isMoon,
    parentRef,
  } = planet;

  const localRef = useRef();
  const actualRef = ref || localRef;

  useFrame(({ clock }) => {
    if (actualRef.current) {
      const elapsed = clock.getElapsedTime();

      if (isMoon && parentRef && parentRef.current) {
        // Moon orbiting around its parent planet
        const parentPosition = parentRef.current.position;
        const x = parentPosition.x + Math.cos(elapsed * speed) * distance;
        const z = parentPosition.z + Math.sin(elapsed * speed) * distance;
        actualRef.current.position.x = x;
        actualRef.current.position.y = parentPosition.y; // Assuming same plane
        actualRef.current.position.z = z;
      } else {
        // Planet orbiting around the sun
        const x = sunPosition.x + Math.cos(elapsed * speed) * distance;
        const z = sunPosition.z + Math.sin(elapsed * speed) * distance*2;
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
    </group>
  );
});

export default Planet;